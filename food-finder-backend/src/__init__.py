from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    static_folder_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static'))
        
    app = Flask(__name__)

    app.config.from_object('src.config.Config')
    
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from src.routes.user_auth import auth_bp
    from src.routes.restaurant import restaurant_bp
    from src.routes.admin import admin_bp
    from src.routes.favorite import favorite_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(restaurant_bp, url_prefix='/api/restaurant')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(favorite_bp, url_prefix='/api/favorites') 


    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        check_path = os.path.join(app.static_folder, path)

        if path != "" and os.path.exists(check_path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app