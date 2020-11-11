import unittest
import flask_testing
import datetime

from flask import Flask

import models_test

from app import create_test_app, test_db
from app.config import Test_Config
from app.models import User

class MyTest(flask_testing.TestCase):

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////mnt/c/users/joaog/Desktop/eu/BCC/2020-2/Getren/getren/backend/test.db"

    def create_app(self):
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        test_db.create_all()

    def tearDown(self):
        test_db.session.remove()
        test_db.drop_all()

class UserTest(MyTest):

    def test_create(self):
        user = User.register("getren@gmail.com", "12345678")
        assert user is not None

    def test_repeated(self):
        user = User.register("getren@gmail.com", "12345678")
        new_user = User.register("getren@gmail.com", "81723981723")
        assert user is not None and new_user is None

    def test_fill_register(self):
        user = User.register("getren@gmail.com", "12345678")
        user = User.update_data("getren@gmail.com", "Getren", \
            datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'), "SP", "São Paulo", "Fisioterapeuta")
        assert user is not None

    
if __name__ == "__main__":
    unittest.main()
    

