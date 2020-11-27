from app import test_db as db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Attends(db.Model):
  __tablename__ = "attends"
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
  course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
  progress = db.Column(db.Integer)
  is_payed = db.Column(db.Boolean)
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
  name = db.Column(db.String(128))
  birthdate = db.Column(db.DateTime())
  federal_state = db.Column(db.String(64), index=True)
  city = db.Column(db.String(64), index=True)
  job = db.Column(db.String(64), index=True)
  is_admin = db.Column(db.Boolean)
  is_confirmed = db.Column(db.Boolean)
  confirmation_token = db.Column(db.String(128))
  password_token = db.Column(db.String(128))
  courses_taken = db.relationship("Attends", back_populates="user")
  courses_taught = db.relationship("Course", secondary=teaches, back_populates="users_teaching")
  videos_watched = db.relationship("Watches", back_populates="user")

  def __repr__(self):
    return '<User email: ' + self.email + '>'

  def as_dict(self):
    user_dict = {}
    for key in ['job', 'federal_state', 'name', 'city', 'birthdate', 'is_confirmed', 'email']:
      user_dict[key] = getattr(self, key)
    user_dict['birthdate'] = datetime.datetime.srtftime(user_dict['birthdate'], '%Y-%m-%d')
    return user_dict
  
  def set_password(self, password):
    self.password_hash = generate_password_hash(password)
    return
  
  def check_password(self, password):
    return check_password_hash(self.password_hash, password)

  @classmethod
  def register(cls, email, password):
    new_user = cls(email=email, password_hash=generate_password_hash(password), is_confirmed = False)
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
    password_hash = generate_password_hash(password)
    password_token = password_hash[30:54]
    user_query = db.session.query(User).filter(User.email==email)
    user_query.update({User.password_hash: password_hash, User.password_token: password_token})
    try:
      db.session.commit()
      return user_query.first()
    except Exception as e:
      return None

  @classmethod
  def update_data(cls, id, request_data):
    user_query = db.session.query(User).filter(User.id==id)
    user_query.update(request_data)
    try:
      db.session.commit()
      return user_query.first()
    except Exception as e:
      return None

  @classmethod
  def confirm_user(cls, email):
    user_query = db.session.query(User).filter(User.email==email)
    user_query.update({User.is_confirmed: True})
    try:
      db.session.commit()
      return user_query.first()
    except Exception as e:
      return None

  @classmethod
  def get_by_id(cls, id):
    try:
      return db.session.query(User).filter(User.id==id).first()
    except Exception as e:
      return None

class Course(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  created_at = db.Column(db.DateTime, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, default=datetime.utcnow)
  number_of_videos = db.Column(db.Integer)
  duration = db.Column(db.Integer)
  expires_at = db.Column(db.DateTime)
  price = db.Column(db.Float)
  is_watchable = db.Column(db.Boolean)
  videos = db.relationship('Video', backref='course', lazy='dynamic')
  users_attending = db.relationship("Attends", back_populates="course")
  users_teaching = db.relationship("User", secondary=teaches, back_populates="courses_taught")

  def __repr__(self):
    return self.name

  def as_dict(self):
    course_dict = {}
    for key in ['id', 'name', 'number_of_videos', 'duration', 'price', 'expires_at', 'is_watchable']:
      course_dict[key] = getattr(self, key)
    return course_dict

  def get_videos_as_dict(self):
    videos = list(self.videos)
    videos_list = []
    for video in videos:
      videos_list.append(video.as_dict())
    return videos_list    

  @classmethod
  def add(cls, request_course):
    try:
      new_course = cls(**request_course)
      db.session.add(new_course)
      db.session.commit()
      return new_course
    except Exception as E:
      return None

  @classmethod
  def get_all(cls):
    try:
      courses = cls.query.all()
    except Exception as e:
      return None
    courses_list = []
    for course in courses:
      courses_list.append(course.as_dict())
    return courses_list
  
  @classmethod
  def get_by_id(cls, id):
    try:
      return db.session.query(Course).filter(Course.id==id).first()
    except Exception as e:
      return None

  @classmethod
  def update_data(cls, id, request_course):
    course_query = db.session.query(Course).filter(Course.id==id)
    try:
      course_query.update(request_course) 
      db.session.commit()
      return course_query.first()
    except Exception as e:
      return None

  @classmethod
  def delete(cls, id):
    course = db.session.query(Course).filter(Course.id==id)
    try:
      course.delete() 
      db.session.commit()
      return True
    except Exception as e:
      return False

class Video(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  youtube_code = db.Column(db.String(128), unique=True, index=True)
  course_order = db.Column(db.Integer)
  course_id = db.Column(db.Integer, db.ForeignKey("course.id"))
  users_viewed = db.relationship("Watches", back_populates="video")

  def __repr__(self):
    return self.youtube_code

  def as_dict(self):
    video_dict = {}
    for key in ['id', 'youtube_code', 'course_order']:
      video_dict[key] = getattr(self, key)
    return video_dict

  @classmethod
  def add(cls, course_id, request_video):
    video = Video(course_id = course_id, **request_video)
    db.session.add(video)
    try:
      db.session.commit()
      return video
    except Exception as e:
      print(e)
      return None

  @classmethod
  def get_by_id(cls, id):
    try:
      return db.session.query(Video).filter(Video.id==id).first()
    except Exception as e:
      return None

  