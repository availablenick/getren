from datetime import datetime
import jwt

from flask import flash, request, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin

from .utils import error_response, is_valid_user, SECRET_KEY
from app import app
from app.models import User, Attends

@app.route('/user/<int:id>', methods=['GET', 'PUT'])
@cross_origin(supports_credentials=True)
def data(id):
    if not is_valid_user(request, id):
        return {}, 401
  
    if request.method == 'PUT':
        result = request.get_json()
        result['birthdate'] = datetime.strptime(result['birthdate'], '%Y-%m-%d')
        user = User.update_data(id, result)
        if user is not None:
            user_dict = user.as_dict()
            response = jsonify(user_dict)
            response.status_code = 200
            return response
        else:
            return error_response('Usuário não atualizado', 500)

    if request.method == 'GET':
        user = User.get_by_id(id)
        if user is None:
            return error_response('Usuário não encontrado', 500)
        user_dict = user.as_dict()
        response = jsonify(user_dict)
        response.status_code = 200
        return response

@app.route('/user/<int:id>/courses', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def attends(id):
    if not is_valid_user(request, id):
        return {}, 401

    if request.method == 'POST':
        request_attends = request.get_json()
        attends = Attends.add(id, request_attends)
        if attends:
            return {}, 200
        return {}, 500

    if request.method == 'GET':
        user = User.get_by_id(id)
        courses_list = user.get_courses()
        response = jsonify(courses_list)
        response.status_code = 200
        return response 
