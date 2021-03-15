import os

class DefaultConfig(object):
    SQLALCHEMY_DATABASE_URI = (f"postgresql://{os.getenv('FLASK_DB_USER')}:\
{os.getenv('FLASK_DB_PASSWORD')}@{os.getenv('FLASK_DB_HOST')}:\
{os.getenv('FLASK_DB_PORT')}/{os.getenv('FLASK_DB_NAME')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = b'\xad\xd3\x10\x8f\xa8\xee\xf8{\xa9k\xceG\xa3\xfd\xec\x1b'
    MAIL_SERVER = os.environ.get('FLASK_MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = os.environ.get('FLASK_MAIL_PORT', '465')
    MAIL_USERNAME = os.environ.get('FLASK_MAIL_USERNAME', 'name@example.com')
    MAIL_PASSWORD =  os.environ.get('FLASK_MAIL_PASSWORD', 'example')
    MAIL_DEFAULT_SENDER = os.environ.get('FLASK_MAIL_SENDER', 'name@example.com')
    MAIL_USE_SSL = os.environ.get('FLASK_MAIL_USE_SSL', True)
    GETREN_MAIL = os.environ.get('GETREN_MAIL', 'name@example.com')

class TestConfig(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql://user:password@database:5432/test'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = b'\xad\xd3\x10\x8f\xa8\xee\xf8{\xa9k\xceG\xa3\xfd\xec\x1b'
