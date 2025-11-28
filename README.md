# 개인화 질문 기반 맛집 추천 앱
사용자와의 질의응답을 통해 취향을 파악하고, 최적의 검색 키워드를 생성하여 주변 맛집을 추천하는 웹 애플리케이션입니다.

## 프로젝트 아키텍처
본 프로젝트는 학과 서버 환경에 맞춰 프론트엔드와 백엔드를 하나의 포트에서 서비스하도록 구성되었으며, 향후 AI 모델 연동을 위해 Node.js의 Child Process를 활용하는 구조를 따릅니다.

- 프론트엔드: React (Vite)

- 백엔드: Node.js, Express

- 데이터베이스: MariaDB

- 인증: JWT (JSON Web Token)

- 외부 API: Kakao Maps API

## 🛠️ 로컬 개발 환경 설정
아래 단계를 따라 로컬 컴퓨터에서 프로젝트를 설정하고 실행할 수 있습니다.

1. 전제 조건
- 다음 프로그램들이 설치되어 있는지 확인해주세요.

- Node.js: LTS 버전

- MariaDB: 공식 홈페이지 (설치 시 root 계정 비밀번호를 기억해주세요.)

- Git: 소스 코드 관리를 위해 필요합니다.

2. 리포지토리 클론

Bash
```
git clone https://github.com/junyongarli/gachon_P_project.git
cd gachon_P_project
```
3. 백엔드 설정 (/food-finder-backend-node)
- 폴더 이동 및 의존성 설치:

Bash
```
cd food-finder-backend-node
npm install
```
- 데이터베이스 생성: HeidiSQL과 같은 데이터베이스 클라이언트로 로컬 MariaDB에 접속한 후, 아래 쿼리를 실행합니다.

SQL
```
CREATE DATABASE food_finder_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
환경 변수 파일 (.env) 생성: food-finder-backend-node 폴더 안에 .env 파일을 만들고, 아래 내용을 자신의 환경에 맞게 채워주세요.

__MariaDB 접속 정보__
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD= # 설치 시 설정한 MariaDB root 비밀번호
DB_NAME=food_finder_db
DB_PORT=3306

__JWT 비밀 키__
JWT_SECRET_KEY=a_very_long_and_secret_string_for_your_project

__카카오 API 키__
KAKAO_REST_API_KEY= # 발급받은 카카오 REST API 키
4. 프론트엔드 설정 (/food-finder)
- 폴더 이동 및 의존성 설치:

Bash
```
cd ../food-finder
npm install
```
환경 변수 파일 (.env) 생성: food-finder 폴더 안에 .env 파일을 만듭니다. 변수 이름은 반드시 VITE_로 시작해야 합니다.

### 카카오맵 API 키
VITE_KAKAO_APP_KEY= # 발급받은 카카오 JavaScript 키

## ▶️ 애플리케이션 실행
개발 시에는 두 개의 터미널을 열어 각각 백엔드와 프론트엔드 서버를 실행해야 합니다.

1. 백엔드 서버 시작
- food-finder-backend-node 폴더로 이동합니다.

- 서버를 실행합니다:

Bash
```
node app.js
```
- 터미널에 🚀 서버가 http://localhost:5000 에서 실행 중입니다. 메시지가 나타나는지 확인합니다.

2. 프론트엔드 서버 시작
- food-finder 폴더로 이동합니다.

- 개발 서버를 실행합니다:

Bash
```
npm run dev
```
- 터미널에 Local: 주소(예: http://localhost:5173)가 나타나는지 확인합니다.

3. 애플리케이션 접속
- 웹 브라우저를 열고 프론트엔드 주소(예: http://localhost:5173)로 접속합니다. 모든 API 호출은 자동으로 백엔드 서버로 전달됩니다.


Github 확인