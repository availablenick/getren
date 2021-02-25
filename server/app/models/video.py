from .. import db

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    youtube_code = db.Column(db.String(128), unique=True, index=True)
    course_order = db.Column(db.Integer)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"))
    title = db.Column(db.String(128))
    description = db.Column(db.Text)
    duration = db.Column(db.Integer)
    thumbnail = db.Column(db.String(256))
    users_viewed = db.relationship("Watches", back_populates="video")

    def __repr__(self):
        return self.title

    def as_dict(self):
        video_dict = {}
        keys = [
            'id',
            'youtube_code',
            'title',
            'description',
            'duration',
            'thumbnail',
            'course_order'
        ]
        for key in keys:
            video_dict[key] = getattr(self, key)
        return video_dict

    @classmethod
    def add(cls, course_id, request_video):
        if 'duration' in request_video:
            duration = request_video['duration']
            index = duration.index(':')
            request_video['duration'] = int(duration[:index])*60 + int(duration[index+1:])
        try:
            video = Video(course_id=course_id, **request_video)
            db.session.add(video)
            db.session.commit()
            return video
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def get_by_id(cls, id):
        try:
            return db.session.query(Video).filter(Video.id==id).first()
        except Exception:
            return None

    @classmethod
    def update_data(cls, id, request_video):
        video_query = db.session.query(Video).filter(Video.id==id)
        if 'duration' in request_video:
            duration = request_video['duration']
            index = duration.index(':')
            request_video['duration'] = int(duration[:index])*60 + int(duration[index+1:])
        try:
            video_query.update(request_video) 
            db.session.commit()
            return video_query.first()
        except Exception:
            db.session.rollback()
            return None

    @classmethod
    def delete(cls, id):
        video = db.session.query(Video).filter(Video.id==id)
        try:
            video.delete() 
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
