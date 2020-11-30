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
CORS(app)
mail = Mail(app)

from app import models
from app.controllers import authentication, profile, delete_db, courses, videos

### Test dependencies ###
def create_test_app():
    app = Flask(__name__)
    app.config.from_object(Test_Config)
    return app

test_db = SQLAlchemy()