from .. import db

class Attends(db.Model):
    __tablename__ = "attends"
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    progress = db.Column(db.Integer)
    is_paid = db.Column(db.Boolean)
    user = db.relationship("User", back_populates="courses_taken")
    course = db.relationship("Course", back_populates="users_attending")

    @classmethod
    def add(cls, id, request_attends):
        request_attends['progress'] = 0
        request_attends['user_id'] = id
        try:
            attends = cls(**request_attends)
            db.session.add(attends)
            db.session.commit()
            return attends
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def check_user_attends_course(cls, user_id, course_id):
        try:
            return db.session.query(Attends).filter({Attends.user_id==user_id, Attends.course_id==course_id}).first()
        except Exception:
            return None