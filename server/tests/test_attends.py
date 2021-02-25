from ..app.models import Attends, Course, User

def test_1_enroll(app, database):
    Course.add({'name': 'Curso 1'})
    User.register(email = 'user@gmail.com', password = '12345678')
    attends = Attends.add(1, {'course_id': 1, 'is_paid': False})
    assert attends is not None and attends.user_id == 1 and attends.course.name == 'Curso 1'

def test_2_enroll_fail(app, database):
    Course.add({'name': 'Curso 1'})
    User.register(email = 'user@gmail.com', password = '12345678')
    attends = Attends.add(3, {'course_id': 3})
    assert attends is None
