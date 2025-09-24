# src/models/user.py
# 필요한 라이브러리들을 임포트합니다. 
# 이 db와 bcrypt 객체는 앱의 메인 파일(__init__.py 또는 app.py)에서 생성되어야 합니다.
from src import db, bcrypt 

class User(db.Model):
    """
    사용자 정보를 저장하기 위한 데이터베이스 모델입니다.
    """
    __tablename__ = 'users' # 데이터베이스 테이블 이름 설정

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    # [핵심] 사용자의 역할을 정의하는 컬럼입니다.
    # 기본값은 'user'이며, 관리자는 'admin' 값을 갖게 됩니다.
    role = db.Column(db.String(50), nullable=False, default='user')

    def __init__(self, username, email, password, role='user'):
        """
        User 객체 생성자입니다.
        비밀번호를 받아서 해시(암호화) 처리 후 저장합니다.
        """
        self.username = username
        self.email = email
        # 비밀번호를 직접 저장하지 않고, bcrypt를 사용해 해시된 값을 저장합니다.
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role

    def check_password(self, password):
        """
        로그인 시, 입력된 비밀번호와 저장된 해시 값을 비교합니다.
        """
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        """
        사용자 객체를 API 응답에 사용하기 좋은 딕셔너리 형태로 변환합니다.
        보안을 위해 비밀번호 해시는 절대 포함하지 않습니다.
        """
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }