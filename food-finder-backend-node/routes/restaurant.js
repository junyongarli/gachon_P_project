// routes/restaurant.js

const express = require('express');
const axios = require('axios');
const { UserPreference } = require('../models');
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

// 구글 API 검색을 수행하는 헬퍼 함수 (변경 없음)
const performGoogleSearch = async (query, apiKey, location) => {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const params = {
        query: query,
        key: apiKey,
        language: 'ko', // 한국어 결과 요청
        // location이 있으면 해당 위치 주변 검색 (bias)
        ...(location ? { location: `${location.latitude},${location.longitude}`, radius: 1500 } : {})
    };
    
    console.log("🔍 Google API 요청:", params.query);
    const response = await axios.get(url, { params });
    return response.data;
};

router.post('/search', async (req, res) => {
    try {
        // [변경] 환경변수 키 이름 변경 (KAKAO -> GOOGLE)
        const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!googleApiKey) {
            return res.status(500).json({ success: false, message: '서버에 Google API 키가 없습니다.' });
        }

        const { answers, location } = req.body;

        // 1~3. 키워드 조합 로직은 기존과 동일 (생략 가능하나 흐름상 유지)
        const categorized = { cuisine: [], ingredient: [], flavor: [] };
        answers.forEach(answer => {
            const keywordInfo = FOOD_KEYWORDS[answer];
            if (keywordInfo && categorized[keywordInfo.type]) {
                categorized[keywordInfo.type].push(...keywordInfo.keywords);
            }
        });

        const queryParts = [];
        if (categorized.cuisine.length > 0)   queryParts.push(categorized.cuisine[0]);
        if (categorized.ingredient.length > 0) queryParts.push(categorized.ingredient[0]);
        if (categorized.flavor.length > 0)     queryParts.push(categorized.flavor[0]);
        
        const finalQuery = queryParts.join(' ') || '맛집';

        // [변경] Google API 호출
        let result = await performGoogleSearch(finalQuery, googleApiKey, location);

        // 4. 결과가 없으면 재검색하는 로직 (Google API에 맞춰 로직 재사용)
        if (result.results.length === 0 && queryParts.length > 1) {
            const fallbackQuery = queryParts.slice(0, 2).join(' ');
            result = await performGoogleSearch(fallbackQuery, googleApiKey, location);
        }

        // 5. [중요] Google 응답 포맷을 프론트엔드가 쓰던 형식으로 변환
        let restaurants = result.results.map(item => {
            // 사진 참조값 추출 (첫 번째 사진 사용)
            const photoReference = item.photos && item.photos.length > 0 
                ? item.photos[0].photo_reference 
                : null;

            return {
                id: item.place_id,
                name: item.name,
                category: item.types ? item.types[0].replace(/_/g, ' ') : '식당',
                address: item.formatted_address,
                x: item.geometry.location.lng,
                y: item.geometry.location.lat,
                url: `https://www.google.com/maps/place/?q=place_id:${item.place_id}`,
                
                // 별점 및 리뷰 수
                rating: item.rating || 0, // 없으면 0점
                user_ratings_total: item.user_ratings_total || 0,
                
                // 사진 참조 코드 (URL은 프론트에서 만듦)
                photo_reference: photoReference
            };
        });
        
        res.json({ success: true, restaurants });

    } catch (error) {
        console.error('Google API 검색 오류:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: '맛집 검색 중 오류가 발생했습니다.' });
    }
});
// [추가] 구글 이미지 프록시 (백엔드 키로 이미지를 대신 가져오는 역할)
router.get('/image/:photo_reference', async (req, res) => {
    try {
        const photoReference = req.params.photo_reference;
        const googleApiKey = process.env.GOOGLE_MAPS_API_KEY; // 제한 없는 백엔드 키 사용

        if (!photoReference || !googleApiKey) {
            return res.status(400).send('Bad Request');
        }

        const url = 'https://maps.googleapis.com/maps/api/place/photo';
        
        // 구글 서버에서 이미지를 받아와서 -> 프론트엔드로 전달 (Stream)
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
        console.error('이미지 가져오기 실패:', error.message);
        res.status(404).send('Image not found');
    }
});
module.exports = router;