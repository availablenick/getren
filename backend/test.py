import unittest
import flask_testing
import datetime
import os
import time

from flask import Flask
from sqlalchemy.exc import InvalidRequestError

import models_test

from app import create_test_app, test_db
from app.config import Test_Config
from app.models import User, Course, Video, Attends

TESTS = 0

class MyTest_User_Course(flask_testing.TestCase):

    def create_app(self):
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        global TESTS
        if TESTS == 0:
            test_db.create_all()
            clear_please(test_db)
            TESTS+=1

    def tearDown(self):
        #test_db.session.remove()
        #test_db.drop_all()
        clear_please(test_db)
        seqs = ['user_id_seq', 'course_id_seq']
        for seq in seqs:
            query = f"ALTER SEQUENCE {seq} RESTART"
            test_db.engine.execute(query)

class MyTest_Video(flask_testing.TestCase):

    def create_app(self):
        global TESTS
        TESTS = 0
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        global TESTS
        if TESTS == 0:
            test_db.create_all()
            clear_please(test_db)
            TESTS+=1

    def tearDown(self):
        clear_please(test_db)
        seqs = ['video_id_seq', 'course_id_seq']
        for seq in seqs:
            query = f"ALTER SEQUENCE {seq} RESTART"
            test_db.engine.execute(query)

class MyTest_Attends(flask_testing.TestCase):

    def create_app(self):
        global TESTS
        TESTS = 0
        app = create_test_app()
        test_db.init_app(app)
        return app

    def setUp(self):
        global TESTS
        if TESTS == 0:
            test_db.create_all()
            clear_please(test_db)
            TESTS+=1

    def tearDown(self):
        clear_please(test_db)
        seqs = ['user_id_seq', 'course_id_seq']
        for seq in seqs:
            query = f"ALTER SEQUENCE {seq} RESTART"
            test_db.engine.execute(query)

class UserTest(MyTest_User_Course):

    def test_1_create(self):
        user = User.register("getren@gmail.com", "12345678")
        assert user is not None

    def test_2_fill_register(self):
        user = User.register("getren@gmail.com", "12345678")
        update_dict = {'name': 'Getren', 'birthdate': datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'),
                        'federal_state': 'SP', 'city': 'São Paulo', 'job': 'Fisioterapeuta'}
        user = User.update_data(1, update_dict)
        assert user is not None

    def test_3_fill_register_miss(self):
        update_dict = {'name': 'Getren', 'birthdate': datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'),
                        'federal_state': 'SP', 'city': 'São Paulo', 'job': 'Fisioterapeuta'}
        user = User.update_data(1, update_dict)
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

    def test_10_repeated(self):
        user = User.register("getren@gmail.com", "12345678")
        new_user = User.register("getren@gmail.com", "81723981723")
        assert user is not None and new_user is None

class CourseTest(MyTest_User_Course):
    
    def test_01_add(self):
        course = Course.add({"name" : "Curso de teste"})
        assert course is not None

    def test_02_add_fail(self):
        course = Course.add({"error" : "fail"})
        assert course is None

    def test_03_get_all(self):
        course = Course.add({"name" : "Curso de teste"})
        courses = Course.get_by_filter("all")
        assert list(courses[0].keys()) == ['id', 'name', 'number_of_videos',
                                            'duration', 'price', 'expires_at', 'is_watchable']

    def test_04_get_expired(self):
        course = Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
        course = Course.add({"name": "Curso de teste 2", "expires_at": "4020-12-10"})
        courses = Course.get_by_filter("expired")
        assert len(courses) == 1 and courses[0]['name'] == "Curso de teste"

    def test_05_get_active(self):
        course = Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
        course = Course.add({"name": "Curso de teste 2", "expires_at": "4020-12-10"})
        courses = Course.get_by_filter("active")
        assert len(courses) == 1 and courses[0]['name'] == "Curso de teste 2"

    def test_05_get_with_search(self):
        course = Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
        course = Course.add({"name": "Batata", "expires_at": "4020-12-10"})
        courses = Course.get_by_filter("Batata")
        assert len(courses) == 1 and courses[0]['name'] == "Batata"    

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
        updated_course_2 = Course.update_data(1, {"error": "Curso de teste não atualizado"})
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
        course = Course.add({'name': "Curso de Teste"})
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        assert video is not None

    def test_02_add_fail(self):
        video = Video.add(2, {'youtube_code': 'test_code', 'course_order': 1})
        assert video is None

    def test_03_get_videos_as_dict(self):
        course = Course.add({'name': "Curso de Teste"})
        course = Course.get_by_id(1)
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        videos = course.get_videos_as_dict()
        assert list(videos[0].keys()) == ['id', 'youtube_code', 'course_order'] and videos[0]['youtube_code'] == 'test_code'

    def test_04_get_by_id(self):
        course = Course.add({'name': "Curso de Teste"})
        video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
        new_video = Video.get_by_id(1)
        video_fail = Video.get_by_id(2)
        assert new_video is not None and new_video.id == video.id and video_fail is None

class AttendsTest(MyTest_Attends):

    def test_1_enroll(self):
        course = Course.add({'name': 'Curso 1'})
        user = User.register(email = 'user@gmail.com', password = '12345678')
        attends = Attends.add(1, {'course_id': 1, 'is_payed': False})
        assert attends is not None and attends.user_id == 1 and attends.course.name == 'Curso 1'

    def test_2_enroll_fail(self):
        course = Course.add({'name': 'Curso 1'})
        user = User.register(email = 'user@gmail.com', password = '12345678')
        attends = Attends.add(3, {'course_id': 3})
        assert attends is None                

def clear_please(db):
    Attends.query.delete()
    Video.query.delete()
    User.query.delete()
    Course.query.delete()
    db.session.commit()

if __name__ == "__main__":
    unittest.main()

