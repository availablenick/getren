from flask import request, make_response, jsonify
from flask_cors import cross_origin
from app.models import User, Course
from app import app
import jwt

SECRET_KEY = app.config['SECRET_KEY']

@app.route('/courses', methods=['GET', 'POST'])
def courses():
  if request.method == 'POST':
    result = request.get_json()
    if is_valid_admin(request):
      course = Course.add(result)
      if course:
        course_dict = course.as_dict()
        response = jsonify(course_dict)
        response.status_code = 200
        return response
      return {}, 500
  elif request.method == 'GET':
    courses = Course.get_all()
    if courses:
      response = jsonify(courses)
      response.status_code = 200
      return response
  return {}, 500


@app.route('/course/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def course(id):
  course = Course.get_by_id(id)
  if course is None:
    return {}, 404
  else:
    if request.method == 'GET':
        course_dict = course.as_dict()
        response = jsonify(course_dict)
        response.status_code = 200
        return response
    else:
      if is_valid_admin(request):
        if request.method == 'PUT':
          result = request.get_json()
          course = Course.update_data(id, result)
          if course:
            course_dict = course.as_dict()
            response = jsonify(course_dict)
            response.status_code = 200
            return response
        else:
          if Course.delete(id):
            return {}, 200
  return {}, 500

def is_valid_admin(request):
  cookie = request.cookies.get('user_token')
  if cookie:
    user_token = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
    user = User.get_by_id(user_token['id'])
    if user.is_admin:
      return True
  return False
