from flask import Flask
from .config import Config, Test_Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)
mail = Mail(app)

from app import models
from app.controllers import authentication, contact, courses, delete_db, profile, texts, videos, youtube

### Test dependencies ###
def create_test_app():
    app = Flask(__name__)
    app.config.from_object(Test_Config)
    return app

test_db = SQLAlchemy()