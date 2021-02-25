from ..app.models import Course, User, Video, Watches

def test_01_add(app, database):
    Course.add({'name': 'Curso de Teste'})
    User.register('getren@gmail.com', '12345678')
    Video.add(1, {'title': 'Video 1'})
    watches = Watches.add(1, 1)
    assert watches is not None

def test_02_add_fail(app, database):
    watches = Watches.add(1, 1)
    assert watches is None

def test_03_as_dict(app, database):
    Course.add({'name': 'Curso de Teste'})
    User.register('getren@gmail.com', '12345678')
    Video.add(1, {'title': 'Video 1'})
    watches = Watches.add(1, 1)
    watches_dict = watches.as_dict()
    assert list(watches_dict.keys()) == ['user_id', 'video_id', 'watched_time', 'finished'] and \
        watches_dict['finished'] == False

def test_04_get_by_id(app, database):
    Course.add({'name': 'Curso de Teste'})
    User.register('getren@gmail.com', '12345678')
    Video.add(1, {'title': 'Video 1'})
    watches = Watches.add(1, 1)
    watches = Watches.get_by_ids(1, 1)
    assert watches is not None

def test_05_get_by_id_fail(app, database):
    watches = Watches.get_by_ids(3, 5)
    assert watches is None

def test_06_update_data(app, database):
    Course.add({'name': 'Curso de Teste'})
    User.register('getren@gmail.com', '12345678')
    Video.add(1, {'title': 'Video 1'})
    Watches.add(1, 1)
    updated = Watches.update_data(1, 1, {'watched_time': 200, 'finished': True})
    assert updated.finished == True and updated.watched_time == 200
