from flask import request, make_response, jsonify
from flask_cors import cross_origin

from .utils import is_valid_admin, error_response, SECRET_KEY
from app import app
from app.models import User, Course, Video
from .youtube import upload_video

@app.route('/course/<int:id>/videos', methods=['GET', 'POST'])
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
                    request_video['youtube_code'] = video['id']
            else:
                request_video = request.get_json()
            video = Video.add(id, request_video)
            if video:
                return {}, 200
            return error_response('Vídeo não adicionado', 500)
        return error_response('Permissão negada', 401)

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