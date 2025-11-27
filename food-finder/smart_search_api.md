# 🔥 스마트 검색 API 명세서

food-finder의 스마트 검색 기능을 위한 백엔드 API 명세서입니다.

---

## 📋 목차

1. [AI 대화형 검색 API](#1-ai-대화형-검색-api)
2. [거리/경로 기반 검색 API](#2-거리경로-기반-검색-api)
3. [개인화 추천 API](#3-개인화-추천-api)
4. [사용자 학습 데이터 API](#4-사용자-학습-데이터-api)

---

## 1. AI 대화형 검색 API

### `POST /api/ai/search`

**기능:** 자연어 입력을 구조화된 검색 조건으로 변환하고 맛집 추천

**인증:** 선택 (로그인 시 개인화 적용)

**Request Body:**
```json
{
  "message": "차 없이 갈 만한 분위기 좋은 이탈리안 레스토랑 알려줘",
  "userLocation": {
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "userPreferences": {
    "favoriteCuisines": ["이탈리안", "한식"],
    "tastePreference": "mild",
    "atmospherePreference": "romantic",
    "priceRange": "medium",
    "diningType": "couple"
  },
  "userHistory": [
    {
      "restaurantId": 3,
      "visitedAt": "2024-01-15T10:30:00Z",
      "rating": 4.5
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "aiResponse": "주변에서 대중교통으로 갈 수 있는 분위기 좋은 이탈리안 레스토랑 3곳을 찾았습니다. 로맨틱한 분위기와 정통 이탈리안 요리를 즐기실 수 있어요!",
  "searchCriteria": {
    "cuisine": "이탈리안",
    "atmosphere": "romantic",
    "transport": "transit",
    "parking": false,
    "features": ["분위기", "대중교통"]
  },
  "restaurants": [
    {
      "id": 5,
      "name": "라 베니스 이탈리아노",
      "category": "양식",
      "address": "서울시 강남구 청담동 123",
      "latitude": 37.5245,
      "longitude": 127.0392,
      "phone": "02-1234-5678",
      "rating": 4.8,
      "matchScore": 94,
      "aiReason": "분위기가 로맨틱하고, 역에서 도보 5분 거리라 차 없이 가기 편해요. 정통 이탈리안 파스타와 와인이 일품입니다.",
      "features": [
        { "name": "대중교통 접근 우수", "icon": "🚇" },
        { "name": "로맨틱한 분위기", "icon": "💑" },
        { "name": "주차 불필요", "icon": "🚶" }
      ],
      "distance": 1.2,
      "travelTime": 15,
      "transportMode": "transit"
    }
  ]
}
```

**AI 자연어 처리 예시:**

| 사용자 입력 | AI 해석 |
|------------|---------|
| "차 없이 갈 만한" | transport: "walk" or "transit", parking: false |
| "분위기 좋은" | atmosphere: "romantic" or "cozy" |
| "이탈리안 레스토랑" | cuisine: "이탈리안", category: "양식" |
| "반려동물 입장 가능" | features: ["petFriendly"] |
| "주차 가능하고 단체" | parking: true, diningType: "group" |
| "도보 10분 이내" | maxDistance: 0.8, transport: "walk" |

**백엔드 구현 로직:**

```javascript
// /api/ai/search

// 1. 자연어 → 구조화된 조건 변환 (ChatGPT/Claude API)
const searchCriteria = await parseNaturalLanguage(message);

// 2. DB 검색
const restaurants = await Restaurant.findAll({
  where: {
    category: searchCriteria.cuisine,
    features: { [Op.contains]: searchCriteria.features }
  }
});

// 3. 거리/경로 필터링
const filteredByDistance = restaurants.filter(r => {
  const distance = calculateDistance(userLocation, r);
  return distance <= searchCriteria.maxDistance;
});

// 4. 매칭도 계산 (사용자 히스토리 + 선호도 반영)
filteredByDistance.forEach(r => {
  r.matchScore = calculateAIMatchScore(r, searchCriteria, userHistory);
});

// 5. 정렬 후 반환
return filteredByDistance.sort((a, b) => b.matchScore - a.matchScore);
```

---

## 2. 거리/경로 기반 검색 API

### `POST /api/restaurant/nearby-smart`

**기능:** 사용자 위치 기준 거리/이동시간/교통수단을 고려한 맛집 검색

**인증:** 선택 (로그인 시 개인화 적용)

**Request Body:**
```json
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "maxDistance": 3.0,
  "transportMode": "walk",
  "userPreferences": {
    "favoriteCuisines": ["한식", "일식"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "restaurants": [
    {
      "id": 1,
      "name": "매운 김치찌개 전문점",
      "category": "한식",
      "address": "서울시 강남구 테헤란로 123",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "phone": "02-1234-5678",
      "rating": 4.5,
      "distance": 0.8,
      "travelTime": 12,
      "travelInfo": {
        "mode": "walk",
        "distance": "0.8km",
        "time": "약 12분",
        "route": "테헤란로 → 역삼역 방향"
      },
      "features": [
        { "name": "도보 접근 용이", "icon": "🚶" },
        { "name": "주차 가능", "icon": "🅿️" }
      ]
    }
  ]
}
```

**transportMode 옵션:**
- `walk`: 도보 (4km/h 기준)
- `car`: 차량 (도심 30km/h 기준)
- `transit`: 대중교통 (20km/h 기준)

**백엔드 구현:**

```javascript
// /api/restaurant/nearby-smart

// 1. 현재 위치 기준 최대 거리 내 맛집 검색
const nearbyRestaurants = await Restaurant.findAll();

// 2. 거리 계산 및 필터링
const filtered = nearbyRestaurants
  .map(r => {
    const distance = calculateDistance(
      latitude, longitude, 
      r.latitude, r.longitude
    );
    const travelTime = calculateTravelTime(distance, transportMode);
    
    return { ...r, distance, travelTime };
  })
  .filter(r => r.distance <= maxDistance);

// 3. 개인화 점수 적용 (선택)
if (userPreferences) {
  filtered.forEach(r => {
    r.personalScore = calculatePersonalScore(r, userPreferences);
  });
}

// 4. 거리 순 또는 개인화 점수 순 정렬
return filtered.sort((a, b) => a.distance - b.distance);
```

**거리 계산 공식 (Haversine):**

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km
}
```

---

## 3. 개인화 추천 API

### `POST /api/restaurant/personalized`

**기능:** 사용자의 방문 히스토리와 선호도를 학습하여 맞춤 추천

**인증:** 필수 (JWT 토큰)

**Request Body:**
```json
{
  "userLocation": {
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "preferences": {
    "favoriteCuisines": ["한식", "이탈리안"],
    "tastePreference": "spicy",
    "atmospherePreference": "casual",
    "priceRange": "medium",
    "diningType": "alone"
  },
  "history": [
    {
      "restaurantId": 3,
      "visitedAt": "2024-01-15T10:30:00Z",
      "rating": 4.5,
      "category": "한식"
    },
    {
      "restaurantId": 7,
      "visitedAt": "2024-01-10T12:00:00Z",
      "rating": 5.0,
      "category": "양식"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "restaurants": [
    {
      "id": 10,
      "name": "매콤 떡볶이 전문점",
      "category": "한식",
      "address": "서울시 강남구 역삼동 456",
      "latitude": 37.5012,
      "longitude": 127.0396,
      "phone": "02-9876-5432",
      "rating": 4.7,
      "personalMatchScore": 96,
      "matchReason": "자주 방문하는 매운 한식과 비슷한 스타일이에요. 혼밥하기 좋은 분위기도 당신 취향!",
      "learningInsights": {
        "frequentCategories": ["한식 60%", "양식 30%", "일식 10%"],
        "preferredTaste": "매운맛 선호도 높음",
        "averageVisitTime": "점심시간 (12:00-13:00)",
        "pricePreference": "1-2만원대"
      },
      "features": [
        { "name": "혼밥 추천", "icon": "🍽️" },
        { "name": "매운맛", "icon": "🌶️" },
        { "name": "가성비", "icon": "💰" }
      ]
    }
  ]
}
```

**개인화 매칭 알고리즘:**

```javascript
// 1. 방문 빈도 분석
const categoryFrequency = analyzeVisitFrequency(userHistory);
// → { "한식": 60%, "양식": 30%, "일식": 10% }

// 2. 평점 기반 선호도 추출
const highRatedCategories = userHistory
  .filter(h => h.rating >= 4.5)
  .map(h => h.category);

// 3. 시간대 패턴 분석
const preferredTimeSlots = analyzeTimePatterns(userHistory);
// → "주로 12:00-13:00에 방문"

// 4. 가격대 선호도
const averagePrice = calculateAveragePrice(userHistory);

// 5. 매칭 점수 계산
restaurants.forEach(r => {
  let score = 0;
  
  // 카테고리 일치 (40점)
  if (categoryFrequency[r.category] > 0.3) score += 40;
  
  // 맛 선호도 일치 (30점)
  if (r.taste === preferences.tastePreference) score += 30;
  
  // 가격대 일치 (15점)
  if (Math.abs(r.price - averagePrice) < 5000) score += 15;
  
  // 분위기 일치 (15점)
  if (r.atmosphere === preferences.atmospherePreference) score += 15;
  
  r.personalMatchScore = score;
});
```

---

## 4. 사용자 학습 데이터 API

### `GET /api/user/preferences`

**기능:** 사용자의 학습된 선호도 조회

**인증:** 필수 (JWT 토큰)

**Response:**
```json
{
  "success": true,
  "preferences": {
    "favoriteCuisines": ["한식", "이탈리안"],
    "tastePreference": "spicy",
    "atmospherePreference": "casual",
    "priceRange": "medium",
    "diningType": "alone",
    "lastUpdated": "2024-01-20T15:30:00Z"
  }
}
```

---

### `GET /api/user/history`

**기능:** 사용자의 방문/검색 히스토리 조회

**인증:** 필수 (JWT 토큰)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "restaurantId": 3,
      "restaurantName": "매운 김치찌개 전문점",
      "category": "한식",
      "visitedAt": "2024-01-15T10:30:00Z",
      "rating": 4.5,
      "action": "visited"
    },
    {
      "restaurantId": 7,
      "restaurantName": "라 베니스",
      "category": "양식",
      "searchedAt": "2024-01-14T12:00:00Z",
      "action": "searched"
    }
  ]
}
```

---

### `POST /api/user/update-preferences`

**기능:** 사용자 행동 기반 선호도 자동 업데이트

**인증:** 필수 (JWT 토큰)

**Request Body:**
```json
{
  "action": "visited",
  "restaurantId": 5,
  "rating": 4.8,
  "timestamp": "2024-01-20T18:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "선호도가 업데이트되었습니다.",
  "updatedPreferences": {
    "favoriteCuisines": ["한식", "이탈리안", "일식"]
  }
}
```

---

## 🔧 필요한 외부 API/라이브러리

### 1. AI 자연어 처리
- **OpenAI GPT-4 API** 또는 **Claude API**
  - 사용자 자연어 입력 → 구조화된 검색 조건 변환
  - 추천 이유 자동 생성

### 2. 지도/경로 API
- **카카오맵 API**
  - 거리 계산
  - 경로 탐색
  - 대중교통 정보

### 3. 데이터베이스
- **PostgreSQL** 또는 **MySQL**
  - 사용자 히스토리 저장
  - 선호도 학습 데이터 저장

---

## 📊 데이터베이스 스키마 추가

### `user_preferences` 테이블

```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  favorite_cuisines JSONB,
  taste_preference VARCHAR(50),
  atmosphere_preference VARCHAR(50),
  price_range VARCHAR(50),
  dining_type VARCHAR(50),
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `user_history` 테이블

```sql
CREATE TABLE user_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  restaurant_id INTEGER REFERENCES restaurants(id),
  action VARCHAR(50), -- 'visited', 'searched', 'favorited'
  rating DECIMAL(2, 1),
  timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `restaurants` 테이블 (기존에 추가할 컬럼)

```sql
ALTER TABLE restaurants ADD COLUMN features JSONB;
ALTER TABLE restaurants ADD COLUMN atmosphere VARCHAR(50);
ALTER TABLE restaurants ADD COLUMN price_range INTEGER;
ALTER TABLE restaurants ADD COLUMN pet_friendly BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN parking_available BOOLEAN DEFAULT false;
```

---

## 🎯 구현 우선순위

### Phase 1 (MVP)
1. ✅ 거리/경로 기반 검색
2. ✅ 기본 개인화 추천 (찜 목록 기반)

### Phase 2
3. 🔄 AI 대화형 검색 (간단한 키워드 파싱)
4. 🔄 사용자 히스토리 수집

### Phase 3
5. 🚀 고급 AI 자연어 처리 (GPT-4 연동)
6. 🚀 머신러닝 기반 선호도 학습

---

## 📝 구현 예시 (Node.js + Express)

```javascript
// /api/ai/search
app.post('/api/ai/search', async (req, res) => {
  const { message, userLocation, userPreferences, userHistory } = req.body;
  
  try {
    // 1. AI로 자연어 파싱
    const searchCriteria = await parseWithAI(message);
    
    // 2. DB 검색
    const restaurants = await searchRestaurants(searchCriteria, userLocation);
    
    // 3. 개인화 점수 적용
    const personalized = applyPersonalization(restaurants, userPreferences, userHistory);
    
    // 4. AI 응답 생성
    const aiResponse = await generateAIResponse(personalized, searchCriteria);
    
    res.json({
      success: true,
      aiResponse,
      searchCriteria,
      restaurants: personalized
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

**이제 백엔드 개발자가 이 명세서를 보고 API를 구현하면 됩니다!** 🎉
