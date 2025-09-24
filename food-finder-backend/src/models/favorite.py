from src import db
from datetime import datetime

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # 카카오맵의 장소 ID는 숫자 형태의 문자열이므로 String으로 저장합니다.
    restaurant_id = db.Column(db.String(50), nullable=False)
    restaurant_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100))
    address = db.Column(db.String(200))
    phone = db.Column(db.String(50))
    url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # User 모델과의 관계 설정 (선택 사항이지만 유용함)
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant_name,
            'category': self.category,
            'address': self.address,
            'phone': self.phone,
            'url': self.url,
            'created_at': self.created_at.isoformat()
        }