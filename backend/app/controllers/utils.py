import jwt

from flask import jsonify

from app import app
from app.models import User

SECRET_KEY = app.config['SECRET_KEY']

def to_seconds(duration):
    return int(duration[0])*60 + int(duration[1])

def decode_duration(duration):
    m_index = duration.index('M')       
    duration = (duration[2:m_index], duration[m_index+1:-1])
    return int(duration[0])*60 + int(duration[1])    

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
    user_payload = { 'email': user.email, 'id': user.id }
    if user.is_admin:
        user_payload['is_admin'] = True
    return jwt.encode(user_payload, SECRET_KEY, algorithm='HS256')

def jsonify_user(user):
    user_payload = { 'email': user.email, 'id': user.id }
    if user.is_admin:
        user_payload['is_admin'] = True
    return jsonify({ 'user': user_payload })

def error_response(error, code):
    response = jsonify({'error': error})
    response.status_code = code
    return response

def decode_user(request):
    cookie = request.cookies.get('user_token')
    if cookie:
        user_payload = jwt.decode(cookie, SECRET_KEY, algorithms=['HS256'])
        return user_payload
    return None

def is_valid_user(request, id):
    user_payload = decode_user(request)
    if user_payload:
        if user_payload['id'] == id:
            return True
    return False

def is_valid_admin(request):
    user_payload = decode_user(request)
    if user_payload:
        if 'is_admin' in user_payload and user_payload['is_admin']:
            return True
    return False
