import json

from flask import Blueprint, request, make_response, jsonify
from flask_cors import cross_origin

from .utils import error_response, is_valid_admin, SECRET_KEY
from ..models.user import User
from ..models.course import Course

bp = Blueprint('courses', __name__)

@bp.route('/courses', methods=['GET', 'POST'], defaults={'filter': 'all'})
@bp.route('/courses/<filter>')
@cross_origin(supports_credentials=True)
def courses(filter):
    if request.method == 'POST':
        json_args = request.form['json_args']
        result = json.loads(json_args)
        while type(result) == str:
            result = json.loads(result)
        if request.files:
            thumbnail = request.files.get('thumbnail')
            result['thumbnail'] = thumbnail.read()
        if is_valid_admin(request):
            course = Course.add(result)
            if course:
                course_dict = course.as_dict()
                response = jsonify(course_dict)
                response.status_code = 200
                return response
            return error_response('Falha na adição do curso', 500)
        else:
            return error_response('Permissão negada', 401)
    elif request.method == 'GET':
        courses = Course.get_by_filter(filter)
        if courses is not None:
            response = jsonify(courses)
            response.status_code = 200
            return response   
        return error_response('Não foi possível recuperar os cursos', 500) 

@bp.route('/courses/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def course(id):
    course = Course.get_by_id(id)
    if course is None:
        return {}, 404
    if request.method == 'GET':
        course_dict = course.as_dict()
        response = jsonify(course_dict)
        response.status_code = 200
        return response
    if is_valid_admin(request):        
        if request.method == 'PUT':
            json_args = request.form['json_args']
            result = json.loads(json_args)
            while type(result) == str:
                result = json.loads(result)
            course = Course.update_data(id, result)
            if course:
                course_dict = course.as_dict()
                response = jsonify(course_dict)
                response.status_code = 200
                return response
            else:
                return error_response('Curso não atualizado', 500)

        elif request.method == 'DELETE':
            if Course.delete(id):
                return {}, 200
            else:
                return error_response('Curso não deletado. Tente novamente em alguns minutos.', 500)
    else:
        return error_response('Permissão negada', 401)
