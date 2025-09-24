# 개인화 질문 기반 맛집 찾기 앱

이 프로젝트는 개인화된 질문을 통해 사용자의 취향에 맞는 맛집을 추천해주는 웹 애플리케이션입니다.

## 기술 스택
- **프론트엔드:** React, Vite, Tailwind CSS
- **백엔드:** Flask, SQLAlchemy, JWT

## 실행 방법

### 1. 프로젝트 다운로드
git clone https://github.com/your-username/your-repo.git

cd your-repo

### 2. 백엔드 설정 (`food-finder-backend`)
cd food-finder-backend

python -m venv .venv

source .venv/Scripts/activate  # Windows: .venv\Scripts\activate

pip install -r requirements.txt

# .env 파일 생성 및 아래 내용 추가
# JWT_SECRET_KEY=매우_안전한_비밀_키
# KAKAO_REST_API_KEY=카카오_REST_API_키
touch .env

### 3. 프론트엔드 설정 (`food-finder`)
cd ../food-finder

npm install

# .env 파일 생성 및 아래 내용 추가
# VITE_KAKAO_APP_KEY=카카오_JavaScript_키
touch .env

### 4. 프론트엔드 빌드
npm run build

### 5. 빌드 파일 백엔드로 복사
- `food-finder/dist/` 안의 `index.html`과 `assets` 폴더를 `food-finder-backend/src/static/` 폴더로 복사합니다.

### 6. 서버 실행
cd ../food-finder-backend

python run.py

이제 브라우저에서 `http://127.0.0.1:5000`으로 접속하세요.
