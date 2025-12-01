// routes/restaurant.js

const express = require('express');
const axios = require('axios');

const router = express.Router();

// [수정됨] 키워드를 종류(type)와 우선순위에 따라 재구성
const FOOD_KEYWORDS = {
    // 1순위: 종류 (Cuisine)
    'korean':   { type: 'cuisine', keywords: ['한식'] },
    'western':  { type: 'cuisine', keywords: ['양식', '이탈리안'] },
    'sweet':    { type: 'cuisine', keywords: ['디저트', '카페'] },

    // 2순위: 재료/기반 (Ingredient/Base)
    'meat':     { type: 'ingredient', keywords: ['고기'] },
    'seafood':  { type: 'ingredient', keywords: ['해산물'] },
    'rice':     { type: 'ingredient', keywords: ['밥집', '백반'] },
    'noodle':   { type: 'ingredient', keywords: ['면요리', '국수'] },

    // 3순위: 맛/특징 (Flavor/Attribute)
    'spicy':    { type: 'flavor', keywords: ['매운'] },
    'mild':     { type: 'flavor', keywords: ['순한'] },
    'hot':      { type: 'flavor', keywords: ['따뜻한', '국물'] },
    'cold':     { type: 'flavor', keywords: ['시원한'] },
    'salty':    { type: 'flavor', keywords: ['짭짤한'] },

    // 기타 (상황/분위기 등) - 검색어 조합에는 사용하지 않음
    'traditional': { type: 'style', keywords: ['전통'] },
    'modern':   { type: 'style', keywords: ['모던', '퓨전'] },
    'alone':    { type: 'style', keywords: ['혼밥'] },
    'group':    { type: 'style', keywords: ['단체', '모임'] }
};

// 카카오 API 검색을 수행하는 헬퍼 함수 (변경 없음)
const performKakaoSearch = async (params, apiKey) => {
    const url = 'https://dapi.kakao.com/v2/local/search/keyword.json';
    const headers = { 'Authorization': `KakaoAK ${apiKey}` };
    console.log("🔍 카카오 API 요청:", params);
    const response = await axios.get(url, { headers, params });
    return response.data;
};

// [수정됨] 맛집 검색 API (/api/restaurant/search)
router.post('/search', async (req, res) => {
    try {
        const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
        if (!kakaoApiKey) {
            return res.status(500).json({ success: false, message: '서버에 카카오 API 키가 설정되지 않았습니다.' });
        }

        const { answers, location } = req.body;
        console.log("백엔드가 프론트로부터 받은 데이터:", req.body);

        // 1. 답변을 종류별로 분류
        const categorized = { cuisine: [], ingredient: [], flavor: [] };
        answers.forEach(answer => {
            const keywordInfo = FOOD_KEYWORDS[answer];
            if (keywordInfo && categorized[keywordInfo.type]) {
                categorized[keywordInfo.type].push(...keywordInfo.keywords);
            }
        });

        // 2. 우선순위에 따라 검색어 조합 (종류 > 재료 > 맛)
        const queryParts = [];
        if (categorized.cuisine.length > 0)   queryParts.push(categorized.cuisine[0]);
        if (categorized.ingredient.length > 0) queryParts.push(categorized.ingredient[0]);
        if (categorized.flavor.length > 0)     queryParts.push(categorized.flavor[0]);
        
        // 3. 최종 검색어 생성
        const finalQuery = queryParts.join(' ');

        let params = { size: 10, category_group_code: 'FD6' };
        if (location?.latitude && location?.longitude) {
            params = {
                ...params,
                x: String(location.longitude),
                y: String(location.latitude),
                radius: 3000,
                sort: 'distance'
            };
        }
        params.query = finalQuery || '맛집'; // 조합된 검색어가 없으면 '맛집'으로 검색

        let result = await performKakaoSearch(params, kakaoApiKey);

        // 4. (선택적) 1차 검색 결과가 없으면, 더 넓은 범위로 2차 검색
        if (result.documents.length === 0 && queryParts.length > 1) {
            console.log("1차 검색 결과 없음. 우선순위 높은 키워드로 2차 검색 시도...");
            const fallbackQuery = queryParts.slice(0, 2).join(' '); // 우선순위 높은 2개 키워드만 사용
            params.query = fallbackQuery;
            result = await performKakaoSearch(params, kakaoApiKey);
        }

        if (result.documents.length === 0 && queryParts.length > 0) {
            console.log("2차 검색 결과 없음. 3차 검색 시도...");
            const finalQuery = queryParts[0]; // 가장 중요한 키워드 하나만 사용
            params.query = finalQuery;
            result = await performKakaoSearch(params, kakaoApiKey);
        }
        // 5. 최종 결과 포맷팅
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