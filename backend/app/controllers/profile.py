from flask import flash, request, render_template, redirect, url_for, jsonify
from app.models import User
from app import app
import datetime
import jwt

SECRET_KEY = app.config['SECRET_KEY']

@app.route('/user/<id>', methods=['GET', 'PUT'])
def dados(id):
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
        nome = result['nome']
        data_nascimento = result['data_nascimento']
        data_nascimento = datetime.datetime.strptime(data_nascimento, '%Y-%m-%d')
        cidade = result['cidade']
        estado = result['estado']
        profissao = result['profissao']
        user = User.update_data(id, nome, data_nascimento, estado, cidade, profissao)
        if user is not None:
            return {}, 200
        else:
            return error_response('Usuário não atualizado', 500)

    if request.method == 'GET':
        user = User.get_by_id(id)
        if user is None:
            return error_response('Usuário não encontrado', 500)
        user_dict = user.get_data()
        response = jsonify(user_dict)
        response.status_code = 200
        return response

def error_response(error, code):
    response = jsonify({'error': error})
    response.status_code = code
    return response

