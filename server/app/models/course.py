import base64

from datetime import date, datetime
from sqlalchemy.sql import func

from .. import db

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    thumbnail = db.Column(db.LargeBinary)
    number_of_videos = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    is_available = db.Column(db.Boolean)
    expires_at = db.Column(db.DateTime)
    price = db.Column(db.Float)
    is_watchable = db.Column(db.Boolean)
    videos = db.relationship('Video', backref='course', lazy='dynamic')
    users_attending = db.relationship("Attends", back_populates="course")

    def __repr__(self):
        return self.name

    def as_dict(self):
        course_dict = {}
        keys = [
            'id',
            'name',
            'number_of_videos',
            'duration',
            'price',
            'is_watchable'
        ]
        for key in keys:
            course_dict[key] = getattr(self, key)
        if self.expires_at:
            course_dict['expires_at'] = datetime.strftime(
                getattr(self, 'expires_at'), "%Y-%m-%d")
        if self.thumbnail:
            thumbnail_base64 = base64.b64encode(self.thumbnail)
            course_dict['thumbnail'] = thumbnail_base64.decode()
        return course_dict

    def get_videos_as_dict(self):
        videos = list(self.videos)
        videos_list = []
        for video in videos:
            videos_list.append(video.as_dict())
        videos_list = sorted(videos_list, key=lambda x: x['course_order'])
        return videos_list

    @classmethod
    def add(cls, request_course):
        try:
            if 'expires_at' in request_course.keys():
                request_course['expires_at'] = datetime.strptime(
                    request_course['expires_at'], "%Y-%m-%d")
            new_course = cls(**request_course)
            db.session.add(new_course)
            db.session.commit()
            return new_course
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def get_by_filter(cls, filter):
        ignorable = ['a', 'de', 'ante', 'para', 'por', 'sob', 'sobre', 'após',
            'perante', 'com', 'entre', 'desde', 'o', 'um', 'uma']
        try:
            if filter == 'all':
                courses = cls.query.all()
            elif filter == 'expired':
                courses = db.session \
                    .query(Course) \
                    .filter(func.date(Course.expires_at) < datetime.today().date()) \
                    .all()
            elif filter == 'active':
                courses = db.session \
                    .query(Course) \
                    .filter(func.date(Course.expires_at) >= datetime.today().date()) \
                    .all()
            else:
                search_words = filter.split('%20')
                courses = db.session.query(Course)
                for word in search_words:
                    courses = courses.filter(Course.name.match(word))
                courses = courses.all()
        except Exception:
            return None
        courses_list = []
        for course in courses:
            courses_list.append(course.as_dict())
        return courses_list

    @classmethod
    def get_by_id(cls, id):
        try:
            return db.session.query(Course).filter(Course.id==id).first()
        except Exception:
            return None

    @classmethod
    def update_data(cls, id, request_course):
        course_query = db.session.query(Course).filter(Course.id==id)
        try:
            course_query.update(request_course)
            db.session.commit()
            return course_query.first()
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def delete(cls, id):
        course = db.session.query(Course).filter(Course.id==id)
        try:
            course.delete()
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
