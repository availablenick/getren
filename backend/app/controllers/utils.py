import jwt

from flask import jsonify

from app import app
from app.models import User

SECRET_KEY = app.config['SECRET_KEY']

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

def is_valid_admin(request):
    cookie = request.cookies.get('user_token')
    if cookie:
        user_token = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
        user = User.get_by_id(user_token['id'])
        if user.is_admin:
            return True
    return False