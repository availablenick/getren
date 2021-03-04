from flask import Blueprint, request, make_response, jsonify
from flask_cors import cross_origin
from json import loads

from .utils import is_valid_admin, error_response, decode_duration, SECRET_KEY
from ..models.user import User
from ..models.course import Course
from ..models.video import Video
from .youtube import upload_video

bp = Blueprint('videos', __name__)

@bp.route('/courses/<int:id>/videos', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def videos(id):
    course = Course.get_by_id(id)
    if course is None:
        return {}, 404

    if request.method=='GET':
        videos = course.get_videos_as_dict()
        response = jsonify(videos)
        response.status_code = 200
        return response

    elif request.method=='POST':
        if is_valid_admin(request):
            request_video = {}
            if request.files:
                upload_succeded, video = upload_video(request.files['video'], request.form)
                if upload_succeded:
                    info = video['snippet']
                    request_video = {'youtube_code': video['id'],
                                    'title': info['title'],
                                    'description': info['description'],
                                    'thumbnail': info['thumbnails']['high']['url'],
                                    'duration': request.form['duration'],
                                    'course_order': int(request.form['course_order'])}                  
            else:
                request_video = request.get_json()
            video = Video.add(id, request_video)
            if video:
                return {}, 200
            return error_response('Vídeo não adicionado', 500)
        return error_response('Permissão negada', 401)

@bp.route('/videos/<int:id>', methods = ['GET', 'PUT', 'DELETE'])
def video(id):
    video = Video.get_by_id(id)
    if video is None:
        return {}, 404

    if request.method == 'GET':
        video_dict = video.as_dict()
        response = jsonify(video_dict)
        response.status_code = 200
        return response

    if is_valid_admin(request):        
        if request.method == 'PUT':
            result = request.get_json()
            video = Video.update_data(id, result)
            if video:
                video_dict = video.as_dict()
                response = jsonify(video_dict)
                response.status_code = 200
                return response
            else:
                return error_response('Video não atualizado', 500)

        elif request.method == 'DELETE':
            if Video.delete(id):
                # deletar no youtube
                return {}, 200
            else:
                return error_response('Video não deletado', 500)
    else:
        return error_response('Permissão negada', 401)
