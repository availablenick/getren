from flask import request, make_response, jsonify
from flask_cors import cross_origin
from app.models import User, Course, Video
from app import app
import jwt

SECRET_KEY = app.config['SECRET_KEY']

@app.route('/course/<int:id>/videos', methods=['GET', 'POST'])
def videos(id):
    course = Course.get_by_id(id)
    if course is None:
        return {}, 404

    if request.method=='POST':
        if is_valid_admin(request):
            result = request.get_json()
            video = Video.add(id, result)
            if video:
                return {}, 200
            return error_response('Vídeo não adicionado', 500)
        return error_response('Permissão negada', 401)

    elif request.method=='GET':
        videos = course.get_videos_as_dict()
        response = jsonify(videos)
        response.status_code = 200
        return response

@app.route('/video/<int:id>', methods = ['GET'])
def video(id):
    video = Video.get_by_id(id)
    if video is None:
        return {}, 404
    else:
        video_dict = video.as_dict()
        response = jsonify(video_dict)
        response.status_code = 200
        return response

def is_valid_admin(request):
    cookie = request.cookies.get('user_token')
    if cookie:
        user_token = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
        user = User.get_by_id(user_token['id'])
        if user.is_admin:
            return True
    return False

def error_response(error, code):
    response = jsonify({'error': error})
    response.status_code = code
    return response