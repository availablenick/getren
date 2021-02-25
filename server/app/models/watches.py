from .. import db

class Watches(db.Model):
    __tablename__ = "watches"
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), primary_key=True)
    watched_time = db.Column(db.Integer)
    finished = db.Column(db.Boolean)
    user = db.relationship("User", back_populates="videos_watched")
    video = db.relationship("Video", back_populates="users_viewed")

    def as_dict(self):
        watches_dict = {}
        for key in ['user_id', 'video_id', 'watched_time', 'finished']:
            watches_dict[key] = getattr(self, key)
        return watches_dict

    @classmethod
    def get_by_ids(cls, user_id, video_id):
        try:
            watches = db.session \
                .query(Watches) \
                .filter(Watches.user_id==user_id,Watches.video_id==video_id) \
                .first()
            return watches.as_dict()
        except Exception as E:
            return None

    @classmethod
    def add(cls, user_id, video_id):
        try:
            watches = Watches(user_id=user_id, video_id=video_id,
                watched_time=0, finished=False)
            db.session.add(watches)
            db.session.commit()
            return watches
        except Exception as e:
            db.session.rollback()
            return None

    @classmethod
    def update_data(cls, user_id, video_id, watches_args):
        try:
            watches = db.session \
                .query(Watches) \
                .filter(Watches.user_id==user_id, Watches.video_id==video_id)
            watches.update(watches_args)
            db.session.commit()
            return watches.first()
        except Exception as e:
            db.session.rollback()
            return None
