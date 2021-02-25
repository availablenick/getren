from ..app.models import Course, Video

def test_01_add(app, database):
    Course.add({'name': "Curso de Teste"})
    video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
    assert video is not None

def test_02_add_fail(app, database):
    video = Video.add(2, {'youtube_code': 'test_code', 'course_order': 1})
    assert video is None

def test_03_get_videos_as_dict(app, database):
    course = Course.add({'name': "Curso de Teste"})
    course = Course.get_by_id(1)
    Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
    videos = course.get_videos_as_dict()
    assert list(videos[0].keys()) == ['id', 'youtube_code', 'title', \
        'description', 'duration', 'thumbnail', 'course_order'] and videos[0]['youtube_code'] == 'test_code'

def test_04_get_by_id(app, database):
    Course.add({'name': "Curso de Teste"})
    video = Video.add(1, {'youtube_code': 'test_code', 'course_order': 1})
    new_video = Video.get_by_id(1)
    video_fail = Video.get_by_id(2)
    assert new_video is not None and new_video.id == video.id and video_fail is None
