import base64

from datetime import date, datetime
from sqlalchemy.sql import func
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash

from app import db

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
    except Exception as e:
      db.session.rollback()
      return None

class Watches(db.Model):
  __tablename__ = "watches"
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
  video_id = db.Column(db.Integer, db.ForeignKey('video.id'), primary_key=True)
  watched_time = db.Column(db.Integer)
  finished = db.Column(db.Boolean)
  user = db.relationship("User", back_populates="videos_watched")
  video =  db.relationship("Video", back_populates="users_viewed")

  def as_dict(self):
    watches_dict = {}
    for key in ['user_id', 'video_id', 'watched_time', 'finished']:
      watches_dict[key] = getattr(self, key)
    return watches_dict

  @classmethod
  def get_by_ids(cls, user_id, video_id):
    try:
      watches = db.session.query(Watches).filter(Watches.user_id==user_id, Watches.video_id==video_id).first()
      return watches.as_dict()
    except Exception as E:
      return None

  @classmethod
  def add(cls, user_id, video_id):
    try:
      watches = Watches(user_id=user_id, video_id=video_id, watched_time=0, finished=False)
      db.session.add(watches)
      db.session.commit()
      return watches
    except Exception as e:
      db.session.rollback()
      return None

  @classmethod
  def update_data(cls, user_id, video_id, watches_args):
    try:
      watches = db.session.query(Watches).filter(Watches.user_id==user_id, Watches.video_id==video_id)
      watches.update(watches_args)
      db.session.commit()
      return watches.first()
    except Exception as e:
      db.session.rollback()
      return None

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
  videos_watched = db.relationship("Watches", back_populates="user")

  def __repr__(self):
    return '<User email: ' + self.email + '>'

  def as_dict(self):
    user_dict = {}
    for key in ['job', 'federal_state', 'name', 'city', 'birthdate', 'is_confirmed', 'email']:
      user_dict[key] = getattr(self, key)

    if user_dict['birthdate']:
      user_dict['birthdate'] = datetime.strftime(user_dict['birthdate'], '%Y-%m-%d')
    else:
      user_dict['birthdate'] = date.today().strftime('%Y-%m-%d')
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
    new_user = cls(email=email, password_hash=generate_password_hash(password), is_confirmed = False)
    new_user.confirmation_token = generate_password_hash(email)[30:54]
    new_user.password_token = generate_password_hash(new_user.password_hash)[30:54]
    db.session.add(new_user)
    try:
      db.session.commit()
      return new_user
    except Exception as e:
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
    except Exception as e:
      db.session.rollback()
      return None

  @classmethod
  def update_data(cls, id, request_data):
    user_query = db.session.query(User).filter(User.id==id)
    user_query.update(request_data)
    try:
      db.session.commit()
      return user_query.first()
    except Exception as e:
      db.session.rollback()
      return None

  @classmethod
  def confirm_user(cls, email):
    user_query = db.session.query(User).filter(User.email==email)
    user_query.update({User.is_confirmed: True})
    try:
      db.session.commit()
      return user_query.first()
    except Exception as e:
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
    except Exception as e:
      return None

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
    for key in ['id', 'name', 'number_of_videos', 'duration', 'price', 'is_watchable']:
      course_dict[key] = getattr(self, key)
    if self.expires_at:
      course_dict['expires_at'] = datetime.strftime(getattr(self, 'expires_at'), "%Y-%m-%d")
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
        request_course['expires_at'] = datetime.strptime(request_course['expires_at'], "%Y-%m-%d")
      new_course = cls(**request_course)
      db.session.add(new_course)
      db.session.commit()
      return new_course
    except Exception as E:
      db.session.rollback()
      return None

  @classmethod
  def get_by_filter(cls, filter):
    ignorable = ['a', 'de', 'ante', 'para', 'por', 'sob', 'sobre', 'após', 'perante', 'com', 'entre', 'desde', 'o',
    'um', 'uma']
    try:
      if filter == 'all':
        courses = cls.query.all()
      elif filter == 'expired':
        courses = db.session.query(Course).filter(func.date(Course.expires_at) < datetime.today().date()).all()
      elif filter == 'active':
        courses = db.session.query(Course).filter(func.date(Course.expires_at) >= datetime.today().date()).all()
      else:
        search_words = filter.split('%20')
        courses = db.session.query(Course)
        for word in search_words:
          courses = courses.filter(Course.name.match(word))
        courses = courses.all()
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
      db.session.rollback()
      return None

  @classmethod
  def delete(cls, id):
    course = db.session.query(Course).filter(Course.id==id)
    try:
      course.delete() 
      db.session.commit()
      return True
    except Exception as e:
      db.session.rollback()
      return False

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
    for key in ['id', 'youtube_code', 'title', 'description', 'duration', 'thumbnail', 'course_order']:
      video_dict[key] = getattr(self, key)
    return video_dict

  @classmethod
  def add(cls, course_id, request_video):
    if 'duration' in request_video:
      duration = request_video['duration']
      index = duration.index(':')
      request_video['duration'] = int(duration[:index])*60 + int(duration[index+1:])
    try:
      video = Video(course_id = course_id, **request_video)
      db.session.add(video)
      db.session.commit()
      return video
    except Exception as E:
      db.session.rollback()
      return None

  @classmethod
  def get_by_id(cls, id):
    try:
      return db.session.query(Video).filter(Video.id==id).first()
    except Exception as e:
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
    except Exception as e:
      db.session.rollback()
      return None

  @classmethod
  def delete(cls, id):
    video = db.session.query(Video).filter(Video.id==id)
    try:
      video.delete() 
      db.session.commit()
      return True
    except Exception as e:
      db.session.rollback()
      return False

class Text(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  body = db.Column(db.Text, nullable=False)
  section = db.Column(db.String(16), index = True)

  @classmethod
  def get_from_section(cls, section):
    text = db.session.query(Text).filter(Text.section == section).first()
    if text:
      return text
    return None

  @classmethod
  def add(cls, section, body):
    try:
      text = cls(section = section, body = body)
      db.session.add(text)
      db.session.commit()
      return text
    except Exception as e:
      db.session.rollback()
      return None

  @classmethod
  def update_body(cls, section, new_body):
    try:
      text = db.session.query(Text).filter(Text.section == section)
      text.update({Text.body: new_body})
      db.session.commit()
      return text.first()
    except Exception as e:
      db.session.rollback()
      return None



    

    
    



  