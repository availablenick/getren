from ..app.models.course import Course

def test_01_add(app, database):
    course = Course.add({"name" : "Curso de teste"})
    assert course is not None

def test_02_add_fail(app, database):
    course = Course.add({"error" : "fail"})
    assert course is None

def test_03_get_all(app, database):
    Course.add({"name" : "Curso de teste"})
    courses = Course.get_by_filter("all")
    assert list(courses[0].keys()) == ['id', 'name', 'number_of_videos',
                                        'duration', 'price', 'is_watchable']

def test_04_get_expired(app, database):
    Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
    Course.add({"name": "Curso de teste 2", "expires_at": "4020-12-10"})
    courses = Course.get_by_filter("expired")
    assert len(courses) == 1 and courses[0]['name'] == "Curso de teste"

def test_05_get_active(app, database):
    Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
    Course.add({"name": "Curso de teste 2", "expires_at": "4020-12-10"})
    courses = Course.get_by_filter("active")
    assert len(courses) == 1 and courses[0]['name'] == "Curso de teste 2"

def test_05_get_with_search(app, database):
    Course.add({"name": "Curso de teste", "expires_at": "2020-11-20"})
    Course.add({"name": "Batata", "expires_at": "4020-12-10"})
    courses = Course.get_by_filter("Batata")
    assert len(courses) == 1 and courses[0]['name'] == "Batata"    

def test_06_get_with_multiple_word_search(app, database):
    Course.add({"name": "Fisioterapia para velhinhos", "expires_at": "2020-11-20"})
    Course.add({"name": "Batata", "expires_at": "4020-12-10"})
    courses = Course.get_by_filter("Fisioterapia%20velhinhos")
    assert len(courses) == 1 and courses[0]['name'] == "Fisioterapia para velhinhos"

def test_04_get_by_id(app, database):
    course = Course.add({"name" : "Curso de teste"})
    new_course = Course.get_by_id(1)
    fail_course = Course.get_by_id(2)
    assert new_course is not None and new_course.id == course.id and fail_course is None

def test_06_update_data(app, database):
    Course.add({"name" : "Curso de teste"})
    Course.update_data(1, {"name": "Curso de teste atualizado"})
    updated_course = Course.get_by_id(1)
    assert updated_course.name == "Curso de teste atualizado"

def test_07_update_data_fail(app, database):
    Course.add({"name" : "Curso de teste"})
    updated_course = Course.update_data(2, {"name": "Curso de teste atualizado"})
    updated_course_2 = Course.update_data(1, {"error": "Curso de teste não atualizado"})
    assert updated_course is None and updated_course_2 is None

def test_08_delete(app, database):
    Course.add({"name" : "Curso de teste"})
    is_deleted = Course.delete(1)
    deleted_course = Course.get_by_id(1)
    assert is_deleted == True and deleted_course is None

def test_09_delete_fail(app, database):
    Course.add({"name" : "Curso de teste"})
    Course.delete(2)
    deleted_course = Course.get_by_id(1)
    assert deleted_course is not None
