# ✅ 스마트 검색 구현 체크리스트

---

## 📂 프론트엔드 (React)

### ✅ 이미 완료된 파일

#### 새로 생성
- ✅ `/pages/SmartSearchPage.jsx` - 스마트 검색 메인 페이지
  - AI 대화형 검색 탭
  - 거리/경로 검색 탭
  - 개인화 추천 탭
  - MOCK 데이터 포함 (백엔드 없이도 작동)

#### 수정 완료
- ✅ `/App.jsx` - 라우팅 추가
  - `<Route path="/smart-search" ... />` 추가

- ✅ `/components/Navbar.jsx` - 네비게이션 메뉴 추가
  - "검색" → "스마트 검색" 변경
  - Sparkles 아이콘 사용

- ✅ `/pages/HomePage.jsx` - 홈페이지 업데이트
  - "스마트 검색 사용하기" 버튼 추가 (보라색-핑크 그라데이션)
  - 스마트 검색 기능 카드 추가 (NEW 뱃지 포함)
  - 4개 카드 그리드로 변경

#### 문서
- ✅ `/SMART_SEARCH_API.md` - 백엔드 API 명세서
- ✅ `/SMART_SEARCH_GUIDE.md` - 사용 가이드
- ✅ `/IMPLEMENTATION_CHECKLIST.md` - 이 체크리스트

---

## 🔧 백엔드 (Node.js + Express)

### ❌ 아직 구현 안 됨 (필수)

#### Phase 1: 기본 기능
- [ ] `POST /api/restaurant/nearby-smart` - 거리/경로 기반 검색
  ```javascript
  // 요청: { latitude, longitude, maxDistance, transportMode }
  // 응답: { restaurants: [...] }
  ```

- [ ] `GET /api/user/preferences` - 사용자 선호도 조회
  ```javascript
  // 헤더: Authorization: Bearer <token>
  // 응답: { preferences: {...} }
  ```

- [ ] `GET /api/user/history` - 사용자 히스토리 조회
  ```javascript
  // 헤더: Authorization: Bearer <token>
  // 응답: { history: [...] }
  ```

#### Phase 2: AI 통합
- [ ] `POST /api/ai/search` - AI 대화형 검색
  ```javascript
  // 요청: { message, userLocation, userPreferences, userHistory }
  // 응답: { aiResponse, restaurants, searchCriteria }
  ```

- [ ] OpenAI GPT-4 API 연동
  - 자연어 → 구조화된 조건 변환
  - AI 응답 생성

#### Phase 3: 개인화
- [ ] `POST /api/restaurant/personalized` - 개인화 추천
  ```javascript
  // 요청: { userLocation, preferences, history }
  // 응답: { restaurants: [...] }
  ```

- [ ] `POST /api/user/update-preferences` - 선호도 자동 업데이트
  ```javascript
  // 요청: { action, restaurantId, rating, timestamp }
  // 응답: { updatedPreferences }
  ```

---

## 🗄️ 데이터베이스 (PostgreSQL/MySQL)

### ❌ 테이블 추가 필요

#### 1. `user_preferences` 테이블
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  favorite_cuisines JSONB DEFAULT '[]',
  taste_preference VARCHAR(50),
  atmosphere_preference VARCHAR(50),
  price_range VARCHAR(50),
  dining_type VARCHAR(50),
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `user_history` 테이블
```sql
CREATE TABLE user_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  action VARCHAR(50) CHECK (action IN ('visited', 'searched', 'favorited')),
  rating DECIMAL(2, 1),
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_user_history_timestamp ON user_history(timestamp DESC);
```

#### 3. `restaurants` 테이블 컬럼 추가
```sql
-- 기존 restaurants 테이블에 추가
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS atmosphere VARCHAR(50);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_range INTEGER;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS wifi_available BOOLEAN DEFAULT false;
```

---

## 🔑 환경 변수 (.env)

### ❌ 추가 필요

```bash
# 백엔드 (.env)
# OpenAI API (AI 대화형 검색용)
OPENAI_API_KEY=your-openai-api-key-here

# 카카오맵 API (경로 탐색용)
KAKAO_REST_API_KEY=your-kakao-rest-api-key

# 프론트엔드 (.env)
# 카카오맵 JavaScript API
VITE_KAKAO_APP_KEY=your-kakao-javascript-key
```

---

## 📦 npm 패키지

### 프론트엔드 (이미 설치됨)
- ✅ `react-router-dom` - 라우팅
- ✅ `motion/react` - 애니메이션
- ✅ `lucide-react` - 아이콘
- ✅ `@radix-ui/*` - shadcn/ui 컴포넌트

### 백엔드 (설치 필요)
```bash
# 필수
npm install openai          # OpenAI API
npm install axios           # HTTP 요청

# 선택 (추천)
npm install node-cache      # 캐싱 (AI 응답 속도 향상)
npm install dotenv          # 환경 변수
```

---

## 🧪 테스트 시나리오

### Phase 1: 기본 동작 확인
- [ ] 홈페이지에서 "스마트 검색 사용하기" 버튼 클릭
- [ ] 3개 탭(AI 대화/거리/개인화) 전환 확인
- [ ] GPS 위치 수집 확인
- [ ] MOCK 데이터로 검색 결과 표시 확인

### Phase 2: 백엔드 연동
- [ ] AI 대화창에서 "차 없이 갈 만한 이탈리안" 입력
- [ ] 2초 후 AI 응답 + 맛집 리스트 표시
- [ ] 거리/경로 탭에서 도보/차량/대중교통 선택 후 검색
- [ ] 맛집 카드에 거리 + 시간 표시 확인

### Phase 3: 개인화
- [ ] 로그인 후 개인화 탭 접근
- [ ] AI 학습 활성화 토글
- [ ] "맞춤 추천받기" 버튼 클릭
- [ ] 취향 매칭도 표시 확인

---

## 🚀 배포 전 체크리스트

### 프론트엔드
- [ ] 모든 페이지 반응형 디자인 확인
- [ ] 모바일 브라우저 테스트
- [ ] 로딩 상태 표시 확인
- [ ] 에러 처리 확인

### 백엔드
- [ ] API 응답 시간 측정 (3초 이내 목표)
- [ ] JWT 토큰 검증 테스트
- [ ] DB 인덱스 추가
- [ ] 로그 시스템 구축

### 보안
- [ ] CORS 설정 확인
- [ ] API Rate Limiting 추가
- [ ] SQL Injection 방지
- [ ] XSS 방지

---

## 📝 다음 단계

### 1단계 (즉시)
1. 백엔드 API 3개 구현
   - `/api/restaurant/nearby-smart`
   - `/api/user/preferences`
   - `/api/user/history`

2. DB 테이블 생성
   - `user_preferences`
   - `user_history`
   - `restaurants` 컬럼 추가

### 2단계 (1주일 내)
3. OpenAI API 연동
   - `/api/ai/search` 구현
   - 자연어 처리 테스트

### 3단계 (2주일 내)
4. 개인화 알고리즘 고도화
   - 머신러닝 모델 적용
   - A/B 테스트

---

## 🔗 참고 문서

- **API 명세서**: `/SMART_SEARCH_API.md`
- **사용 가이드**: `/SMART_SEARCH_GUIDE.md`
- **Haversine 공식**: https://en.wikipedia.org/wiki/Haversine_formula
- **OpenAI API Docs**: https://platform.openai.com/docs

---

## 💬 문의

- 프론트엔드 이슈: SmartSearchPage.jsx 확인
- 백엔드 이슈: SMART_SEARCH_API.md 참조
- 배포 이슈: DevOps 팀 문의

---

**마지막 업데이트**: 2025-11-27
**작성자**: AI Assistant
**버전**: 1.0
