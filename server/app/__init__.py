from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail

import mercadopago
sdk = mercadopago.SDK("TEST-2384855633651220-033117-1c1a1c967655793ecb9be006024d41ae-148582266")

from .config import DefaultConfig, TestConfig

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()

def create_app(is_testing=False):
    app = Flask(__name__)
    if is_testing:
        app.config.from_object(TestConfig)
        db.init_app(app)
    else:
        app.config.from_object(DefaultConfig)
        db.init_app(app)
        mail.init_app(app)
        migrate.init_app(app, db)
        CORS(app, supports_credentials=True)

        from ..database import seeds
        seeds.init_app(app)

        with app.app_context():
            from .controllers import (authentication, contact, courses,
                delete_db, profile, texts, videos, youtube)

            app.register_blueprint(authentication.bp)
            app.register_blueprint(contact.bp)
            app.register_blueprint(courses.bp)
            app.register_blueprint(delete_db.bp)
            app.register_blueprint(profile.bp)
            app.register_blueprint(texts.bp)
            app.register_blueprint(videos.bp)
            app.register_blueprint(youtube.bp)

    return app
