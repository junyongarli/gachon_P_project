// routes/restaurant.js

const express = require('express');
const axios = require('axios'); // API 호출을 위한 axios

const router = express.Router();

// 음식 취향 키워드 매핑 (Python의 딕셔너리를 JavaScript 객체로)
const FOOD_KEYWORDS = {
    'spicy': ['매운', '떡볶이', '김치찌개', '마라탕', '불닭'], 'mild': ['순한', '된장찌개', '미역국', '백반', '정식'],
    'korean': ['한식', '김치', '불고기', '갈비', '비빔밥'], 'western': ['양식', '파스타', '피자', '스테이크', '햄버거'],
    'rice': ['밥', '덮밥', '볶음밥', '비빔밥', '정식'], 'noodle': ['면', '라면', '냉면', '파스타', '우동'],
    'meat': ['고기', '삼겹살', '갈비', '치킨', '스테이크'], 'seafood': ['해산물', '회', '조개', '새우', '게'],
    'hot': ['뜨거운', '찌개', '국물', '탕', '전골'], 'cold': ['차가운', '냉면', '회', '샐러드', '아이스크림'],
    'salty': ['짠', '젓갈', '김치', '라면', '치킨'], 'sweet': ['단', '디저트', '케이크', '아이스크림', '과일'],
    'traditional': ['전통', '한정식', '백반', '정통', '옛날'], 'modern': ['모던', '퓨전', '신메뉴', '트렌드', '새로운'],
    'alone': ['혼밥', '1인분', '간단한', '가벼운', '테이크아웃'], 'group': ['단체', '회식', '모임', '가족', '여럿이']
};

// 카카오 API 검색을 수행하는 헬퍼 함수
const performKakaoSearch = async (params, apiKey) => {
    const url = 'https://dapi.kakao.com/v2/local/search/keyword.json';
    const headers = { 'Authorization': `KakaoAK ${apiKey}` };
    console.log("🔍 카카오 API 요청:", params); // 디버깅용 로그
    const response = await axios.get(url, { headers, params });
    return response.data;
};

// ## 맛집 검색 API (/api/restaurant/search)
router.post('/search', async (req, res) => {
    console.log("백엔드가 프론트로부터 받은 데이터:", req.body);
    try {
        const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
        if (!kakaoApiKey) {
            return res.status(500).json({ success: false, message: '서버에 카카오 API 키가 설정되지 않았습니다.' });
        }

        const { answers, location } = req.body;

        // 1. 키워드 생성
        const keywords = answers.flatMap(answer => FOOD_KEYWORDS[answer] || []);
        const uniqueKeywords = [...new Set(keywords)];

        let params = { size: 10, category_group_code: 'FD6' };
        if (location?.latitude && location?.longitude) {
            params = {
                ...params,
                x: String(location.longitude),
                y: String(location.latitude),
                radius: 2000,
                sort: 'distance'
            };
        }

        // 2. 1단계 검색: 구체적인 키워드 (최대 2개)
        params.query = uniqueKeywords.slice(0, 2).join(' ') || '맛집';
        let result = await performKakaoSearch(params, kakaoApiKey);

        // 3. 2단계 검색: 1단계 결과가 없으면, 핵심 키워드 1개로 재검색
        if (result.documents.length === 0 && uniqueKeywords.length > 1) {
            params.query = uniqueKeywords[0];
            result = await performKakaoSearch(params, kakaoApiKey);
        }

        // 4. 최종 결과 포맷팅
        const restaurants = result.documents.map(item => ({
            id: item.id,
            name: item.place_name,
            category: item.category_name,
            address: item.address_name,
            phone: item.phone,
            distance: item.distance ? `${item.distance}m` : '알 수 없음',
            url: item.place_url,
            x: item.x,
            y: item.y,
        }));
        
        res.json({ success: true, restaurants });

    } catch (error) {
        console.error('카카오 API 검색 오류:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: '맛집 검색 중 오류가 발생했습니다.' });
    }
});

module.exports = router;