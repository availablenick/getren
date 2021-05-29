import jwt

from flask import current_app, jsonify

from ..models.user import User
from .. import sdk
from uuid import uuid4

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

def generate_course_preference(course_dict): 
    temp_token = str(uuid4())
    fake_token = str(uuid4())
    preference_data = {
            "items": [
                {
                    "title": course_dict["name"],
                    "quantity": 1,
                    "unit_price": course_dict["price"]
                }
            ],
            "back_urls": {
                "success": "https://localhost:3000/cursos/"+str(course_dict["id"])+"/success/"+temp_token,
                "failure": "https://localhost:3000/cursos/"+str(course_dict["id"])+"/failure/"+fake_token,
                "pending": "https://localhost:3000/cursos/"+str(course_dict["id"])+"/pending/"+fake_token,
            }
        }
    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]
    return preference["id"], temp_token

def generate_token(user):
    return jwt.encode(user.as_dict(), current_app.config['SECRET_KEY'],
        algorithm='HS256')

def jsonify_user(user):
    return jsonify(user.as_dict())

def error_response(error, code):
    response = jsonify({'error': error})
    response.status_code = code
    return response

def decode_user(request):
    cookie = request.cookies.get('user_token')
    if cookie:
        user_payload = jwt.decode(cookie, current_app.config['SECRET_KEY'],
            algorithms=['HS256'])
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
