from app import db
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
  confirmation = db.Column(db.Boolean)
  confirmation_token = db.Column(db.String(128))
  password_token = db.Column(db.String(128))
  courses_taken = db.relationship("Attends", back_populates="user")
  courses_taught = db.relationship("Course", secondary=teaches, back_populates="users_teaching")
  videos_watched = db.relationship("Watches", back_populates="user")

  def __repr__(self):
    return '<User email: ' + self.email + '>'

  def set_password(self, password):
    self.password_hash = generate_password_hash(password)
    return
  
  def check_password(self, password):
    return check_password_hash(self.password_hash, password)

  @classmethod
  def register(cls, email, password):
    new_user = cls(email=email, password_hash=generate_password_hash(password), confirmation = False)
    new_user.confirmation_token = generate_password_hash(email)[30:54]
    new_user.password_token = generate_password_hash(new_user.password_hash)[30:54]
    db.session.add(new_user)
    try:
      db.session.commit()
      return new_user
    except Exception as x:
      return None

  @classmethod
  def update_password(cls, email, password):
    user = db.session.query(User).filter(User.email==email)
    user.update({User.password_hash: generate_password_hash(password)})
    try:
      db.session.commit()
    except Exception as e:
      return None
    user = user.first()
    new_token = generate_password_hash(user.password_hash)[30:54]
    db.session.query(User).filter(User.email==email).update({User.password_token: new_token})
    try:
      db.session.commit()
      return db.session.query(User).filter(User.email==email).first()
    except Exception as e:
      return None

  @classmethod
  def update_data(cls, email, nome, data_nascimento, estado, cidade, profissao):
    db.session.query(User).filter(User.email==email).update({User.nome: nome, User.data_nascimento: data_nascimento, User.estado: estado, User.cidade: cidade, User.profissao: profissao})
    try:
      db.session.commit()
      return db.session.query(User).filter(User.email==email).first()
    except Exception as e:
      return None

  @classmethod
  def confirm_user(cls, email):
    db.session.query(User).filter(User.email==email).update({User.confirmation: True})
    try:
      db.session.commit()
      return db.session.query(User).filter(User.email==email).first()
    except Exception as e:
      return None



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