from datetime import date, datetime
from werkzeug.security import generate_password_hash, check_password_hash

from .. import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(128))
    birthdate = db.Column(db.Date)
    federal_state = db.Column(db.String(64), index=True)
    city = db.Column(db.String(64), index=True)
    job = db.Column(db.String(64), index=True)
    is_admin = db.Column(db.Boolean)
    is_confirmed = db.Column(db.Boolean)
    confirmation_token = db.Column(db.String(128))
    password_token = db.Column(db.String(128))
    courses_taken = db.relationship("Attends", back_populates="user")
    videos_watched = db.relationship("Watches", back_populates="user")

    def __repr__(self):
        return '<User email: ' + self.email + '>'

    def as_dict(self):
        user_dict = {}
        keys = [
            'birthdate',
            'city',
            'email',
            'federal_state',
            'id',
            'is_admin',
            'is_confirmed',
            'job',
            'name'
        ]
        for key in keys:
            user_dict[key] = getattr(self, key)

        if user_dict['birthdate']:
            user_dict['birthdate'] = datetime.strftime(user_dict['birthdate'],
                '%Y-%m-%d')
        else:
            user_dict['birthdate'] = date.today().strftime('%Y-%m-%d')

        user_dict['courses_taken'] = []
        for enrollment in getattr(self, 'courses_taken'):
            user_dict['courses_taken'].append(enrollment.course.as_dict())

        user_dict['videos_watched'] = []
        for watching in getattr(self, 'videos_watched'):
            user_dict['videos_watched'].append(watching.video.as_dict())

        return user_dict

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        return

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_courses(self):
        attended_courses = self.courses_taken
        course_list = []
        for attended_course in attended_courses:
            course_list.append(attended_course.course.as_dict())
        return course_list

    @classmethod
    def register(cls, email, password):
        new_user = cls(
            email=email,
            password_hash=generate_password_hash(password),
            is_confirmed=False
        )
        new_user.confirmation_token = generate_password_hash(email)[30:54]
        new_user.password_token = generate_password_hash(new_user.password_hash)[30:54]
        db.session.add(new_user)
        try:
            db.session.commit()
            return new_user
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def update_password(cls, email, password):
        password_hash = generate_password_hash(password)
        password_token = password_hash[30:54]
        user_query = db.session.query(User).filter(User.email==email)
        user_query.update({User.password_hash: password_hash, User.password_token: password_token})
        try:
            db.session.commit()
            return user_query.first()
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def update_data(cls, id, request_data):
        print('b4 query')
        user_query = db.session.query(User).filter(User.id==id)
        print('after query')
        user_query.update(request_data)
        try:
            db.session.commit()
            return user_query.first()
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def confirm_user(cls, email):
        user_query = db.session.query(User).filter(User.email==email)
        user_query.update({User.is_confirmed: True})
        try:
            db.session.commit()
            return user_query.first()
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def give_admin(cls, id):
        db.session.query(User).filter(User.id==id).update({User.is_admin: True})
        db.session.commit()
        return 

    @classmethod
    def get_by_id(cls, id):
        try:
            return db.session.query(User).filter(User.id==id).first()
        except Exception:
            return None
