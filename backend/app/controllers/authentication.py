from flask import request
from flask_mail import Message
from app.models import User
from app import app, mail
from multiprocessing import Process
import re

@app.route('/register', methods = ['GET', 'POST'])
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
            send_email = Process(target=confirm_email, args=(email,), daemon=True)
            send_email.start()
            response = {
                'status': 200,
                'user': {
                    'email': user.email,
                    'password': user.password_hash
                }
            }
            return response
            
        response = {
            'status': 400,
            'errors': errors
        }
        return response

    return {'confirmed': 0, 'errors': error}

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            response = {
                'status': 400,
                'error': 'O usuário/senha está incorreto/a'
            }
            return response
        else:
            response = {
                'status': 200,
                'user': {
                    'email': user.email,
                    'password': user.password_hash
                }
            }
            return response
    return {'confirmed': 0, 'error': error}


@app.route('/confirmation', methods=['GET', 'POST'])
def confirmation():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    token = user.confirmation_token
    link = f'/confirmacao?email={email}&token={token}'
    confirmed = result['confirmed']
    if confirmed == False:
        msg = Message("Verificação de Conta", recipients=[email])
        msg.html = f"Você se registrou em getren.com.br. Para confirmar sua conta, acesse <a href={link}>AQUI</a>. Caso não tenha sido você, apenas ignore esta mensagem. Obrigado, equipe Getren"
        try:
            mail.send(msg)
            return {'status': 200}
        except Exception as E:
            return {'status': 500}
    if confirmed == True:
        try:
            if token == result['token']:
                User.confirm_user(email)
                return {'status': 200}
            else:
                return {'status': 400}
        except Exception as E:
            return {'status': 500}

@app.route('/password_forgot', methods=['GET', 'POST'])
def forgotten_password():
    result = request.get_json()
    email = result['email']
    user = User.query.filter_by(email=email).first()
    token = user.password_token
    link = f'/refresh_password?email={email}&token={token}'
    msg = Message("Redefinição de Senha", recipients=[email])
    msg.html = f"Você solicitou uma redefinição de senha. Para redefini-la, acesse <a href={link}>AQUI</a>. Caso não tenha solicitado a redefinição de senha, ignore essa mensagem"
    try:
        mail.send(msg)
        return {'status': 200}
    except Exception as E:
        return {'status': 500}

@app.route('/redefine_password', methods=['GET', 'POST'])
def redefine_password():
    result = request.get_json()
    email = result['email']
    new_password = result['password']
    user = User.query.filter_by(email=email).first()
    token = user.password_token
    try:
        if token == result['token']:
            User.update_password(email, new_password)
            return {'status': 200}
        else:
            return {'status': 400}
    except Exception as E:
        return {'status': 500}

def confirm_email(email):
    user = User.query.filter_by(email=email).first()
    token = user.confirmation_token
    link = f'/confirmacao?email={email}&token={token}'
    msg = Message("Verificação de Conta", recipients=[email])
    msg.html = f"Você se registrou em getren.com.br. Para confirmar sua conta, acesse <a href={link}>AQUI</a>. Caso não tenha sido você, apenas ignore esta mensagem. Obrigado, equipe Getren"
    mail.send(msg)


