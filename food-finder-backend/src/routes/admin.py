from flask import Blueprint, jsonify
from src.models.user import User
from src.routes.user_auth import admin_required # 이전에 만든 데코레이터 임포트

admin_bp = Blueprint('admin_api', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required() # ✅ 이 데코레이터가 관리자만 이 API를 호출할 수 있도록 막아줍니다.
def get_all_users():
    """전체 사용자 목록을 조회합니다."""
    try:
        users = User.query.all()
        return jsonify(success=True, users=[user.to_dict() for user in users])
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500