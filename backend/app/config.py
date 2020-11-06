import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = b'\xad\xd3\x10\x8f\xa8\xee\xf8{\xa9k\xceG\xa3\xfd\xec\x1b'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = '465'
    MAIL_USERNAME = 'getren.xp@gmail.com'
    MAIL_PASSWORD = 'alfredogoldxp'
    MAIL_DEFAULT_SENDER = 'getren.xp@gmail.com'
    MAIL_USE_SSL = True