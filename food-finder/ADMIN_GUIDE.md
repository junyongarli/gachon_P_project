# 관리자 페이지 가이드 📚

## 🔐 관리자 페이지 동작 원리.

### 1. 인증 흐름

```
사용자 접속
    ↓
AuthContext에서 user.role 확인
    ↓
role === 'admin'?
    ↓ YES                     ↓ NO
관리자 패널 표시         로그인 페이지로 리다이렉트
```

### 2. 핵심 컴포넌트

#### **AuthContext** (`/contexts/AuthContext.jsx`)
- 사용자 인증 상태 관리
- localStorage에 user와 token 저장
- `user.role`로 권한 체크y

```javascript
const { user, token, login, logout } = useAuth();

// user 객체 구조:
{
  id: 1,
  username: '홍길동',
  email: 'user@example.com',
  role: 'admin' // 'admin', 'owner', 'user'
}
```

#### **AdminRoute** (`/components/AdminRoute.jsx`)
- 관리자 권한 체크 가드
- `user.role !== 'admin'` → `/login`으로 리다이렉트
- `user.role === 'admin'` → 하위 라우트 렌더링

```javascript
// App.jsx에서 사용
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    {/* 여기 있는 페이지들은 관리자만 접근 가능 */}
  </Route>
</Route>
```

#### **AdminLayout** (`/components/admin/AdminLayout.jsx`)
- 사이드바 + 메인 콘텐츠 구조
- 모든 관리자 페이지의 공통 레이아웃

---

## 🧪 개발 환경 테스트 방법

### 방법 1: 개발용 버튼 사용 (가장 빠름! 🚀)

1. 앱 실행
2. 화면 우측 하단에 **"[개발] 관리자 로그인"** 버튼 클릭
3. 자동으로 관리자 계정으로 로그인됨
4. **"관리자 패널 열기"** 버튼 클릭 또는 수동으로 `/admin` 이동

```javascript
// 자동 생성되는 관리자 계정 정보
{
  id: 999,
  username: '관리자',
  email: 'admin@foodfinder.com',
  role: 'admin'
}
```

### 방법 2: 브라우저 콘솔에서 직접 설정

개발자 도구(F12) → Console 탭에서 실행:

```javascript
// 관리자로 로그인
localStorage.setItem('user', JSON.stringify({
  id: 999,
  username: '관리자',
  email: 'admin@foodfinder.com',
  role: 'admin'
}));
localStorage.setItem('token', 'dev-token-12345');

// 페이지 새로고침
location.reload();
```

### 방법 3: 로그인 페이지 수정 (실제 백엔드 연동 시)

로그인 API 응답에서 `role` 필드를 포함:

```javascript
// LoginPage.jsx
const handleLogin = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // data 예시:
  // {
  //   user: { id: 1, username: '홍길동', role: 'admin' },
  //   token: 'jwt-token-here'
  // }
  
  login(data.user, data.token);
};
```

---

## 📂 관리자 페이지 URL 구조

```
/admin                     → 대시보드 (통계 요약)
/admin/users               → 시설자 관리
/admin/notifications       → 시설자 알림 관리
/admin/ai                  → AI 프롬프트 관리
/admin/community           → 커뮤니티 관리
/admin/statistics          → 통계 리포트
/admin/settings            → 시스템 설정
```

---

## 🎨 주요 기능

### 1. 대시보드 (`/admin`)
- 전체 통계 요약
- 실시간 활동 로그
- 주요 지표 카드

### 2. 시설자 관리 (`/admin/users`)
- 전체 사용자 목록
- 역할별 필터링 (admin, owner, user)
- 사용자 상태 관리 (활성, 정지)
- 검색 기능

### 3. 알림 관리 (`/admin/notifications`)
- 푸시 알림 전송
- 발송 내역 관리
- 대상 선택 (전체/시설자/일반)

### 4. AI 관리 (`/admin/ai`)
- AI 프롬프트 편집
- 정확도 모니터링
- 사용량 통계

### 5. 커뮤니티 관리 (`/admin/community`)
- 게시글 승인/삭제
- 신고 처리
- 댓글 관리

### 6. 통계 (`/admin/statistics`)
- 사용자 증가 추이
- 인기 카테고리
- TOP 맛집 순위

### 7. 설정 (`/admin/settings`)
- 시스템 전역 설정
- 보안 옵션
- 알림 설정

---

## 🔧 실제 백엔드 연동 방법

### 1. API 엔드포인트 예시

```javascript
// AdminUsers.jsx에서
const fetchUsers = async () => {
  const response = await fetch('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}` // ← 인증 토큰
    }
  });
  
  const data = await response.json();
  setUsers(data.users);
};
```

### 2. 필요한 백엔드 API

```
GET    /api/admin/users              - 사용자 목록
POST   /api/admin/users              - 사용자 추가
PATCH  /api/admin/users/:id          - 사용자 수정
DELETE /api/admin/users/:id          - 사용자 삭제

POST   /api/admin/notifications      - 알림 전송
GET    /api/admin/notifications      - 알림 내역

GET    /api/admin/statistics         - 통계 데이터
GET    /api/admin/community/posts    - 게시글 목록
PATCH  /api/admin/community/posts/:id - 게시글 승인/삭제
```

### 3. 권한 체크 (백엔드)

```javascript
// Express.js 예시
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '권한이 없습니다' });
  }
  next();
};

app.get('/api/admin/users', requireAdmin, (req, res) => {
  // 관리자만 접근 가능
});
```

---

## 🚀 배포 전 체크리스트

- [ ] `DevAdminButton` 컴포넌트 제거 또는 주석 처리
- [ ] 목업 데이터를 실제 API 호출로 교체
- [ ] 백엔드 권한 체크 구현
- [ ] HTTPS 사용
- [ ] 관리자 계정 보안 강화 (2FA 등)
- [ ] 에러 처리 및 로깅

---

## 💡 팁

### 로컬스토리지 초기화
```javascript
// 콘솔에서 실행
localStorage.clear();
location.reload();
```

### 현재 사용자 정보 확인
```javascript
// 콘솔에서 실행
JSON.parse(localStorage.getItem('user'));
```

### 관리자로 빠르게 전환
```javascript
// 콘솔에서 실행
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'admin';
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

---

## 🐛 문제 해결

### "로그인이 필요합니다" 계속 뜰 때
1. localStorage에 user와 token이 있는지 확인
2. user.role이 'admin'인지 확인
3. AuthProvider가 App을 감싸고 있는지 확인

### 관리자 페이지가 보이지 않을 때
1. `/admin` URL로 직접 접속해보기
2. AdminRoute가 제대로 동작하는지 확인
3. 브라우저 콘솔에서 에러 확인

---

**개발용 버튼은 실제 배포 시 반드시 제거하세요!** 🔒
