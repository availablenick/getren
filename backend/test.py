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

    def test_1_create(self):
        user = User.register("getren@gmail.com", "12345678")
        assert user is not None

    def test_2_fill_register(self):
        user = User.register("getren@gmail.com", "12345678")
        user = User.update_data(1, "Getren", \
            datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'), "SP", "São Paulo", "Fisioterapeuta")
        assert user is not None

    def test_3_fill_register_miss(self):
        user = User.update_data("getren@gmail.com", "Getren", \
            datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'), "SP", "São Paulo", "Fisioterapeuta")
        assert user is None

    def test_4_confirmation(self):
        user = User.register("getren@gmail.com", "12345678")
        user = User.confirm_user("getren@gmail.com")
        assert user is not None

    def test_5_confirmation_miss(self):
        user = User.confirm_user("getren@gmail.com")
        assert user is None

    def test_6_update_password(self):
        user = User.register("getren@gmail.com", "12345678")
        user = User.update_password("getren@gmail.com", "87654321")
        assert user is not None

    def test_7_update_miss(self):
        user = User.update_password("getren@gmail.com", "12345678")
        assert user is None   

    def test_8_get_by_id_hit(self):
        user = User.register("getren@gmail.com", "12345678")
        user = User.get_by_id(1)
        assert user is not None

    def test_9_get_by_id_miss(self):
        user = User.get_by_id(1)
        assert user is None

    def test_ZZZ_repeated(self):
        user = User.register("getren@gmail.com", "12345678")
        new_user = User.register("getren@gmail.com", "81723981723")
        assert user is not None and new_user is None

if __name__ == "__main__":
    unittest.main()
    

