// routes/restaurant.js
const express = require('express');
const router = express.Router();
const axios = require('axios'); // 이미지 프록시용

// 키워드 정의
const FOOD_KEYWORDS = {
    'korean':   { type: 'cuisine', keywords: ['한식'] },
    'western':  { type: 'cuisine', keywords: ['양식', '이탈리안', '브런치'] },
    'chinese':  { type: 'cuisine', keywords: ['중식', '중화요리'] },
    'japanese': { type: 'cuisine', keywords: ['일식', '초밥', '이자카야'] },
    'sweet':    { type: 'cuisine', keywords: ['디저트', '카페'] },

    'meat':     { type: 'ingredient', keywords: ['고기', '구이', '스테이크'] },
    'seafood':  { type: 'ingredient', keywords: ['해산물', '회', '매운탕'] },
    'rice':     { type: 'ingredient', keywords: ['밥집', '덮밥', '정식'] },
    'noodle':   { type: 'ingredient', keywords: ['면요리', '국수', '파스타', '짬뽕'] },

    'spicy':    { type: 'flavor', keywords: ['매운', '얼큰한'] },
    'mild':     { type: 'flavor', keywords: ['순한', '담백한'] },
    'hot':      { type: 'flavor', keywords: ['따뜻한', '국물', '전골', '찌개'] },
    'cold':     { type: 'flavor', keywords: ['시원한', '냉면'] },
    'salty':    { type: 'flavor', keywords: ['짭짤한'] },

    'alcohol':  { type: 'style', keywords: ['술집', '포차'] },
    'alone':    { type: 'style', keywords: ['혼밥'] },
    'group':    { type: 'style', keywords: ['단체'] },
    'modern':   { type: 'style', keywords: ['분위기 좋은'] },
    'traditional': { type: 'style', keywords: ['전통', '노포'] },

    'near':     { type: 'distance', keywords: [] }, 
    'far':      { type: 'distance', keywords: [] }
};

// [핵심 변경] 구글 검색 안 함! 검색어(String)만 생성해서 응답함.
router.post('/search', (req, res) => {
    try {
        const { answers } = req.body;
        const categorized = { cuisine: [], ingredient: [], flavor: [], style: [], distance: [] };
        
        answers.forEach(answer => {
            if (!answer) return;
            const keywordInfo = FOOD_KEYWORDS[answer];
            if (keywordInfo) {
                if (!categorized[keywordInfo.type]) categorized[keywordInfo.type] = [];
                categorized[keywordInfo.type].push(...keywordInfo.keywords);
                
                // [추가] 거리 타입은 별도로 저장 (키워드 자체를 저장)
                if (keywordInfo.type === 'distance') {
                    categorized.distance.push(answer);
                }
            }
        });

        // 검색어 조합
        const queryParts = [];
        
        const isDessert = categorized.cuisine.includes('디저트') || categorized.cuisine.includes('카페');

        if (categorized.cuisine.length > 0) queryParts.push(categorized.cuisine[0]);

        if (!isDessert) {
            if (categorized.ingredient.length > 0) queryParts.push(categorized.ingredient[0]);
            if (categorized.flavor.length > 0) queryParts.push(categorized.flavor[0]);
        } else {
            if (categorized.style && categorized.style.length > 0) queryParts.push(categorized.style[0]);
        }

        // 술/분위기 키워드는 상황에 따라 뒤에 붙임
        if (categorized.style.includes('술집') || categorized.style.includes('포차')) {
             queryParts.push(categorized.style[0]);
        }

        let finalQuery = queryParts.join(' ');
        
        // 검색어가 너무 휑하면(예: 다 null이라서 빈 문자열이면) 기본값 설정
        if (!finalQuery.trim()) {
            finalQuery = "맛집"; 
        } else if (!finalQuery.includes('맛집') && !finalQuery.includes('카페') && !finalQuery.includes('술집')) {
             finalQuery += ' 맛집';
        }
        let searchRadius = 50000;
        if (categorized.distance.includes('near')) {
            searchRadius = 3000; // '근처' 선택 시 3km 이내로 제한
            console.log("📍 거리 제한 적용: 가까운 곳 (3km)");
        } else if (categorized.distance.includes('far')) {
            searchRadius = 80000; // '멀리' 선택 시 80km까지 확장
            console.log("📍 거리 제한 적용: 멀리 (80km)");
        }
        console.log(`✅ 전달 검색어: "${finalQuery}", 반경: ${searchRadius}m`);
        res.json({ success: true, query: finalQuery, radius: searchRadius });

    } catch (error) {
        console.error("검색어 생성 오류:", error);
        res.status(500).json({ success: false, message: '검색어 생성 실패' });
    }
});

// 이미지 프록시 (유지)
router.get('/image/:photo_reference', async (req, res) => {
    try {
        const photoReference = req.params.photo_reference;
        const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!photoReference || !googleApiKey) {
            return res.status(400).send('Bad Request');
        }

        const url = 'https://maps.googleapis.com/maps/api/place/photo';
        const response = await axios.get(url, {
            params: {
                maxwidth: 400,
                photoreference: photoReference,
                key: googleApiKey
            },
            responseType: 'stream'
        });
        response.data.pipe(res);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

module.exports = router;