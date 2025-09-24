from flask import Blueprint, request, jsonify
from src.models.user import User
from src import db
from flask_jwt_extended import create_access_token, get_jwt, verify_jwt_in_request
from functools import wraps

# 1. Blueprint 객체를 먼저 생성합니다.
auth_bp = Blueprint('auth', __name__)

# 2. 그 다음에 데코레이터나 라우트 함수들을 정의합니다.
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
                if claims.get("role") == 'admin':
                    return fn(*args, **kwargs)
                else:
                    return jsonify(success=False, message="관리자 권한이 필요합니다."), 403
            except Exception as e:
                return jsonify(success=False, message=str(e)), 422
        return decorator
    return wrapper

@auth_bp.route('/register', methods=['POST'])
def register():
    """회원가입 API"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify(success=False, message="모든 필드를 입력해주세요."), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify(success=False, message="이미 존재하는 사용자 이름 또는 이메일입니다."), 409

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(success=True, message="회원가입이 완료되었습니다.", user=new_user.to_dict()), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """로그인 API"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify(success=False, message="이메일과 비밀번호를 모두 입력해주세요."), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(
            # ▼▼▼ 여기가 최종 수정된 부분입니다! ▼▼▼
            identity=str(user.id), # ✅ user.id를 반드시 문자열로 변환합니다.
            # ▲▲▲ 여기가 최종 수정된 부분입니다! ▲▲▲
            additional_claims={'role': user.role}
        )
        return jsonify(success=True, access_token=access_token, user=user.to_dict())
    else:
        return jsonify(success=False, message="이메일 또는 비밀번호가 올바르지 않습니다."), 401