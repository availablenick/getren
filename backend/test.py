import unittest
import flask_testing
import datetime
import os
import time

from flask import Flask

import models_test

from app import create_test_app, test_db
from app.config import Test_Config
from app.models import User, Course, Video

class MyTest_User(flask_testing.TestCase):

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

class MyTest_Course(flask_testing.TestCase):
    
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////mnt/c/users/joaog/Desktop/eu/BCC/2020-2/Getren/getren/backend/test.db"

    def create_app(self):
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        test_db.create_all()
        test_db.session.commit()

    def tearDown(self):
        test_db.session.remove()
        test_db.drop_all()

class MyTest_Video(flask_testing.TestCase):

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////mnt/c/users/joaog/Desktop/eu/BCC/2020-2/Getren/getren/backend/test.db"

    def create_app(self):
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        test_db.create_all()
        course = Course(name = "Curso de Teste")
        test_db.session.add(course)
        test_db.session.commit()

    def tearDown(self):
        test_db.session.remove()
        test_db.drop_all()

class ZZZ_UserTest(MyTest_User):

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

class CourseTest(MyTest_Course):
    
    def test_01_add(self):
        course = Course.add({"name" : "Curso de teste"})
        assert course is not None

    def test_02_add_fail(self):
        course = Course.add({"error" : "aiosduioasdiasu"})
        assert course is None

    def test_03_get_all(self):
        course = Course.add({"name" : "Curso de teste"})
        courses = Course.get_all()
        assert list(courses[0].keys()) == ['id', 'name', 'number_of_videos', 'duration']

    def test_04_get_by_id(self):
        course = Course.add({"name" : "Curso de teste"})
        new_course = Course.get_by_id(1)
        fail_course = Course.get_by_id(2)
        assert new_course is not None and new_course.id == course.id and fail_course is None

    def test_06_update_data(self):
        course = Course.add({"name" : "Curso de teste"})
        course = Course.update_data(1, {"name": "Curso de teste atualizado"})
        updated_course = Course.get_by_id(1)
        assert updated_course.name == "Curso de teste atualizado"
    
    def test_07_update_data_fail(self):
        course = Course.add({"name" : "Curso de teste"})
        updated_course = Course.update_data(2, {"name": "Curso de teste atualizado"})
        updated_course_2 = Course.update_data(1, {"error": "Curso de teste atualizado"})
        assert updated_course is None and updated_course_2 is None

    def test_08_delete(self):
        course = Course.add({"name" : "Curso de teste"})
        is_deleted = Course.delete(1)
        deleted_course = Course.get_by_id(1)
        assert is_deleted == True and deleted_course is None
    
    def test_09_delete_fail(self):
        course = Course.add({"name" : "Curso de teste"})
        Course.delete(2)
        deleted_course = Course.get_by_id(1)
        assert deleted_course is not None

class VideoTest(MyTest_Video):

    def test_01_add(self):
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        assert video is not None

    def test_02_add_fail(self):
        # CHANGE AFTER POSTGRES
        video = Video.add(2, {'youtube_code': 'test_code', 'course_order': 1})
        assert video is not None

    def test_03_get_videos_as_dict(self):
        course = Course.get_by_id(1)
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        videos = course.get_videos_as_dict()
        assert list(videos[0].keys()) == ['id', 'youtube_code', 'course_order'] and videos[0]['youtube_code'] == 'test_code'

    def test_04_get_by_id(self):
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        new_video = Video.get_by_id(1)
        video_fail = Video.get_by_id(2)
        assert new_video is not None and new_video.id == video.id and video_fail is None

if __name__ == "__main__":
    unittest.main()
    

