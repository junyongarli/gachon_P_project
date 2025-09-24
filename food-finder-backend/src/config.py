import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv() # .env 파일 로드

class Config:  # <-- 이 클래스 이름이 정확한지 확인하세요!
    """Flask 애플리케이션 설정 클래스"""
    
    # JWT 서명을 위한 시크릿 키, .env 파일에서 가져옵니다.
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-default-jwt-secret-key')
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    # 프로젝트 루트에 'app.db'라는 이름의 SQLite 데이터베이스를 사용합니다.
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False