from datetime import datetime
import jwt

from flask import flash, request, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin

from .utils import error_response, SECRET_KEY
from app import app
from app.models import User

@app.route('/user/<id>', methods=['GET', 'PUT'])
@cross_origin(supports_credentials=True)
def data(id):
    id = int(id)
    cookie = request.cookies.get('user_token')
    if cookie:
        user = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
        if user['id'] != id:
            return {}, 401
    else:
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