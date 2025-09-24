from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src import db
from src.models.favorite import Favorite

favorite_bp = Blueprint('favorite_api', __name__)

@favorite_bp.route('', methods=['POST'])
@jwt_required()
def add_favorite():
    """맛집을 찜 목록에 추가합니다."""
    user_id = get_jwt_identity()
    data = request.get_json()

    # 필수 정보가 있는지 확인
    if not data or not data.get('restaurant_id') or not data.get('restaurant_name'):
        return jsonify(success=False, message="맛집 정보가 필요합니다."), 400

    # 이미 찜한 맛집인지 확인
    existing_favorite = Favorite.query.filter_by(user_id=user_id, restaurant_id=data['restaurant_id']).first()
    if existing_favorite:
        return jsonify(success=False, message="이미 찜한 맛집입니다."), 409

    new_favorite = Favorite(
        user_id=user_id,
        restaurant_id=data.get('restaurant_id'),
        restaurant_name=data.get('restaurant_name'),
        category=data.get('category'),
        address=data.get('address'),
        phone=data.get('phone'),
        url=data.get('url')
    )
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify(success=True, message="맛집을 찜했습니다.", favorite=new_favorite.to_dict()), 201

@favorite_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    """로그인한 사용자의 찜 목록을 불러옵니다."""
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
    return jsonify(success=True, favorites=[fav.to_dict() for fav in favorites])