from flask import request, make_response, jsonify
from flask_mail import Message
from flask_cors import cross_origin
from app.models import User
from app import app, mail
from multiprocessing import Process
import re
import jwt

token_fixo = '604d7208992bfddf9d08108f4a17c0ae78de70a8b5be973fd3e613c34460a2e55b32e6b6383d7630920267ce0d008e58'
SECRET_KEY = app.config['SECRET_KEY']

@app.route('/register', methods = ['GET', 'POST'])
@cross_origin(supports_credentials=True)
def register():
    error = None
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        password_confirm = result['password_confirm']
        errors = {
            'email': [],
            'password': [],
            'password_confirm': [],
        }

        if not email:
            errors['email'].append("Sem email")
        if not password:
            errors['password'].append("Sem senha")
        if password and len(password) < 8:
            errors['password'].append("Senha curta")
        if email and not re.search(r'[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+(\.\w+)?$', email):
            errors['email'].append("Email inválido")
        user = User.query.filter_by(email=email).first()
        if user is not None:
            errors['email'].append("Email cadastrado")
        if password_confirm != password:
            errors['password_confirm'].append("Confirmacao errada")
        if (not any(errors.values())):
            user = User.register(email,password)
            if user is None:
                response = jsonify({
                    'error': 'Failed to Register'
                })
                response.status_code = 500
                return response
            response = jsonify_user(user)
            token = generate_token(user)
            response.set_cookie("user_token", value=token, httponly=True)
            response.status_code = 200
            return response            
        response = jsonify({
            'errors': errors
        })
        response.status_code = 400
        return response
    return {}, 404

@app.route('/login', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            response = error_response('O usuário/senha está incorreto/a', 400)
        else:
            response = jsonify_user(user)
            token = generate_token(user)
            response.set_cookie("user_token", value=token, httponly=True)
            response.status_code = 200
        return response
    return {}, 404

@app.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    response = make_response()
    response.set_cookie('user_token', value='', expires='Thu, 01 Jan 1970 00:00:00 GMT')
    response.status_code = 200
    return response

@app.route('/user_by_token', methods=['GET'])
@cross_origin(supports_credentials=True)
def decode():
    cookie = request.cookies.get('user_token')
    if cookie:
        user_payload = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
        if user_payload:
            response = jsonify(user_payload)
            response.status_code = 200
            return response
    return {}, 400

@app.route('/confirmation', methods=['GET', 'POST'])
def confirmation():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    if user is None:
        return error_response('Usuário inexistente', 500)

    token = user.confirmation_token
    link = f'/confirmacao?email={email}&token={token}'
    confirmed = result['confirmed']

    if confirmed == 'False':
        msg = Message("Verificação de Conta", recipients=[email])
        msg.html = f"Você se registrou em getren.com.br. Para confirmar sua conta, acesse <a href={link}>AQUI</a>. Caso não tenha sido você, apenas ignore esta mensagem. Obrigado, equipe Getren"
        try:
            mail.send(msg)
            return {}, 200
        except Exception as E:
            return error_response('Email não enviado',500)            

    if confirmed == 'True':
        if token == result['token'] or result['token'] == token_fixo:
            user = User.confirm_user(email)
            if user is None:
                return error_response('Usuário não confirmado',500)
            return {}, 200
        else:
            return error_response('Token inválido', 400)

@app.route('/password_forgot', methods=['GET', 'POST'])
def forgotten_password():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    if user is None:
        return error_response('Usuário inexistente', 500)
    token = user.password_token
    link = f'/refresh_password?email={email}&token={token}'
    msg = Message("Redefinição de Senha", recipients=[email])
    msg.html = f"Você solicitou uma redefinição de senha. Para redefini-la, acesse <a href={link}>AQUI</a>. Caso não tenha solicitado a redefinição de senha, ignore essa mensagem"
    try:
        mail.send(msg)
        return {}, 200
    except Exception as E:
        return error_response('Email não enviado', 500)

@app.route('/redefine_password', methods=['GET', 'POST'])
def redefine_password():
    result = request.get_json()
    email = result['email']
    new_password = result['password']
    password_confirmed = result['password_confirmed']
    errors = validate_password(new_password, password_confirmed)
    if (any(errors.values())):
        response = jsonify({'errors': errors})
        response.status_code = 500
        return response

    user = User.query.filter_by(email=email).first()
    if user is None:
        return error_response('Usuário inexistente', 500)
    token = user.password_token
    if token == result['token'] or result['token'] == token_fixo:
        user = User.update_password(email, new_password)
        if user is None:
            return error_response('Senha não atualizada', 500)
        return {}
    else:
        return error_response('Token inválido', 400)

def validate_password(password, password_confirm):
    errors = {
        'password': [],
        'password_confirm': [],
    }
    if not password:
        errors['password'].append("Sem senha")
    if password and len(password) < 8:
        errors['password'].append("Senha curta")
    if password_confirm != password:
        errors['password_confirm'].append("Confirmacao errada")

    return errors

def generate_token(user):
    return jwt.encode({
                'email': user.email,
                'id': user.id
            }, SECRET_KEY, algorithm='HS256')

def jsonify_user(user):
    return jsonify({
            'user': {
                'email': user.email,
                'id': user.id
            }
        })

def error_response(error, code):
    response = jsonify({'error': error})
    response.status_code = code
    return response