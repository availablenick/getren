from app import test_db as db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Attends(db.Model):
  __tablename__ = "attends"
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
  course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
  progress = db.Column(db.Integer)
  user = db.relationship("User", back_populates="courses_taken")
  course = db.relationship("Course", back_populates="users_attending")

class Watches(db.Model):
  __tablename__ = "watches"
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
  video_id = db.Column(db.Integer, db.ForeignKey('video.id'), primary_key=True)
  watched_time = db.Column(db.Integer)
  finished = db.Column(db.Boolean)
  user = db.relationship("User", back_populates="videos_watched")
  video =  db.relationship("Video", back_populates="users_viewed")

teaches = db.Table('teaches',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(64), index=True, unique=True)
  password_hash = db.Column(db.String(128))
  nome = db.Column(db.String(128))
  data_nascimento = db.Column(db.DateTime())
  estado = db.Column(db.String(64), index=True)
  cidade = db.Column(db.String(64), index=True)
  profissao = db.Column(db.String(64), index=True)
  courses_taken = db.relationship("Attends", back_populates="user")
  courses_taught = db.relationship("Course", secondary=teaches, back_populates="users_teaching")
  videos_watched = db.relationship("Watches", back_populates="user")

  def __repr__(self):
    return '<User email: ' + self.email + self.password_hash + '>'

  def set_password(self, password):
    self.password_hash = generate_password_hash(password)
    return
  
  def check_password(self, password):
    return check_password_hash(self.password_hash, password)

  @classmethod
  def register(cls, email, password):
    new_user = cls(email=email, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    try:
      db.session.commit()
      return new_user
    except Exception as x:
      return None

  @classmethod
  def update_data(cls, email, nome, data_nascimento, estado, cidade, profissao):
    db.session.query(User).filter(User.email==email).update({User.nome: nome, User.data_nascimento: data_nascimento, User.estado: estado, User.cidade: cidade, User.profissao: profissao})
    db.session.commit()


class Course(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  created_at = db.Column(db.DateTime, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, default=datetime.utcnow)
  number_of_videos = db.Column(db.Integer)
  duration = db.Column(db.Integer)
  videos = db.relationship('Video', backref='course', lazy='dynamic')
  users_attending = db.relationship("Attends", back_populates="course")
  users_teaching = db.relationship("User", secondary=teaches, back_populates="courses_taught")

  def __repr__(self):
    return self.name

class Video(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  youtube_code = db.Column(db.String(128))
  course_id = db.Column(db.Integer, db.ForeignKey("course.id"))
  users_viewed = db.relationship("Watches", back_populates="video")

  def __repr__(self):
    return self.youtube_code