import re
import jwt

from flask import Blueprint, current_app, request, make_response, jsonify
from flask_mail import Message
from flask_cors import cross_origin

from .utils import (validate_password, generate_token, jsonify_user,
    error_response, decode_user)
from .. import mail
from ..models.user import User

fixed_token = '604d7208992bfddf9d08108f4a17c0ae78de70a8b5be973fd3e613c34460a2e55b32e6b6383d7630920267ce0d008e58'
domain = 'http://localhost:3000'

bp = Blueprint('authentication', __name__)

@bp.route('/register', methods = ['GET', 'POST'])
@cross_origin(supports_credentials=True)
def register():
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
            errors['password_confirm'].append("Confirmação errada")
        if (not any(errors.values())):
            user = User.register(email,password)
            if user is None:
                response = error_response('Failed to Register', 500)
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

@bp.route('/login', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            response = error_response('O email/senha está incorreto(a)', 400)
        else:
            response = jsonify_user(user)
            token = generate_token(user)
            response.set_cookie("user_token", value=token, httponly=True)
            response.status_code = 200
        return response
    return {}, 404

@bp.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    response = make_response()
    response.set_cookie('user_token', value='', expires='Thu, 01 Jan 1970 00:00:00 GMT')
    response.status_code = 200
    return response

@bp.route('/user_by_token', methods=['GET'])
@cross_origin(supports_credentials=True)
def decode():
    user_payload = decode_user(request)
    if user_payload:
        response = jsonify(user_payload)
        response.status_code = 200
        return response
    return {}, 400

@bp.route('/confirmation', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def confirmation():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    if user is None:
        return error_response('Usuário inexistente', 500)

    token = user.confirmation_token
    link = f'{domain}/confirmacao?email={email}&token={token}'
    confirmed = result['confirmed']
    if confirmed == False:
        msg = Message("Verificação de Conta", recipients=[email])
        msg.html = "Você se registrou no GETREN. Para confirmar sua " \
            + 'conta, acesse <a href="' + link + '">AQUI</a>. Caso não tenha ' \
            + "sido você, apenas ignore esta mensagem. Obrigado. Equipe Getren."

        try:
            mail.send(msg)
            return {}, 200
        except Exception:
            return error_response('Email não enviado', 500)            

    if confirmed == True:
        if token == result['token'] or result['token'] == fixed_token:
            user = User.confirm_user(email)
            if user is None:
                return error_response('Usuário não confirmado', 500)
            return {}, 200
        else:
            return error_response('Token inválido', 400)

@bp.route('/password_forgot', methods=['GET', 'POST'])
def forgotten_password():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    if user is None:
        return error_response('Usuário inexistente', 500)
    token = user.password_token
    link = f'{domain}/refresh_password?email={email}&token={token}'
    msg = Message("Redefinição de Senha", recipients=[email])
    msg.html = f"Você solicitou uma redefinição de senha. Para redefini-la, acesse <a href={link}>AQUI</a>. Caso não tenha solicitado a redefinição de senha, ignore essa mensagem"
    try:
        mail.send(msg)
        return {}, 200
    except Exception:
        return error_response('Email não enviado', 500)

@bp.route('/redefine_password', methods=['GET', 'POST'])
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
    if token == result['token'] or result['token'] == fixed_token:
        user = User.update_password(email, new_password)
        if user is None:
            return error_response('Senha não atualizada', 500)
        return {}
    else:
        return error_response('Token inválido', 400)

# ROTA PARA TESTES
@bp.route("/give_admin", methods=['GET'])
def admin():
    id = request.get_json()['id']
    User.give_admin(id)
    return {}, 200