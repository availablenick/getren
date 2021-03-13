from flask.cli import AppGroup, with_appcontext
from werkzeug.security import generate_password_hash

from ..app import db
from ..app.models import Attends, Course, User, Video

database_cli = AppGroup('database', short_help='Database-related commands')

@database_cli.command('seed')
@with_appcontext
def feed_database():
    """ Feeds database with data """

    # Users
    for i in range(5):
        user = User(
            email='user' + str(i+1) + '@example.com',
            password_hash=generate_password_hash('nopass123'),
            name='user' + str(i+1),
            birthdate='2000-01-01',
            federal_state='AC',
            city='Xapuri',
            job='Emprego ' + str(i+1),
            is_admin=False,
            is_confirmed=True
        )

        db.session.add(user)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

    admin = User(
        email='adm@adm.adm',
        password_hash=generate_password_hash('admin123'),
        name='admin',
        birthdate='2000-01-01',
        federal_state='AC',
        city='Xapuri',
        job='Administrador',
        is_admin=True,
        is_confirmed=True
    )

    db.session.add(admin)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()

    # Courses
    for i in range(20):
        course = Course(
            name='Course ' + str(i+1),
            thumbnail=None,
            number_of_videos=10,
            duration=6,
            is_available=True,
            expires_at=None,
            price=200,
            is_watchable=True
        )

        db.session.add(course)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

    # Videos
    youtube_videos_codes = [
        'jNQXAC9IVRw',
        'Br0Jn-d8_Co',
        'y8Kyi0WNg40',
        'ZN5PoW7_kdA',
        'GAHfZNPoLW0'
    ]
    for i in range(len(youtube_videos_codes)):
        video = Video(
            youtube_code=youtube_videos_codes[i],
            course_order=i,
            course_id=1,
            title='Video ' + str(i+1),
            description='Video ' + str(i+1) + '\'s description',
            duration=15,
            thumbnail=None
        )

        db.session.add(video)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

    for i in range(20):
        attends = Attends(
            user_id=6,
            course_id=i+1,
            progress=80+i,
            is_paid=True
        )

        db.session.add(attends)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

    db.session.close()

@database_cli.command('wipe')
@with_appcontext
def wipe_database():
    """ Removes all records """

    print('Wiping database...')
    db.drop_all()
    db.create_all()
    db.session.close()
    print('Done...')

def init_app(app):
    app.cli.add_command(database_cli)
