import datetime

from ..app.models.user import User

def test_1_create(app, database):
    user = User.register("getren@gmail.com", "12345678")
    assert user is not None

def test_2_fill_register(app, database):
    user = User.register("getren@gmail.com", "12345678")
    update_dict = {
        'name': 'Getren',
        'birthdate': datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'),
        'federal_state': 'SP',
        'city': 'São Paulo',
        'job': 'Fisioterapeuta'
    }
    user = User.update_data(1, update_dict)
    assert user is not None

def test_3_fill_register_miss(app, database):
    update_dict = {'name': 'Getren', 'birthdate': datetime.datetime.strptime("2020-11-11", '%Y-%m-%d'),
                    'federal_state': 'SP', 'city': 'São Paulo', 'job': 'Fisioterapeuta'}
    user = User.update_data(1, update_dict)
    assert user is None

def test_4_confirmation(app, database):
    user = User.register("getren@gmail.com", "12345678")
    user = User.confirm_user("getren@gmail.com")
    assert user is not None

def test_5_confirmation_miss(app, database):
    user = User.confirm_user("getren@gmail.com")
    assert user is None

def test_6_update_password(app, database):
    user = User.register("getren@gmail.com", "12345678")
    user = User.update_password("getren@gmail.com", "87654321")
    assert user is not None

def test_7_update_miss(app, database):
    user = User.update_password("getren@gmail.com", "12345678")
    assert user is None   

def test_8_get_by_id_hit(app, database):
    user = User.register("getren@gmail.com", "12345678")
    user = User.get_by_id(1)
    assert user is not None

def test_9_get_by_id_miss(app, database):
    user = User.get_by_id(1)
    assert user is None

def test_10_repeated(app, database):
    user = User.register("getren@gmail.com", "12345678")
    new_user = User.register("getren@gmail.com", "81723981723")
    assert user is not None and new_user is None
