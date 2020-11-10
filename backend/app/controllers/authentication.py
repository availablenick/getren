from flask import request
from app.models import User
from app import app
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
            if user:
                response = {
                    'status': 200,
                    'user': {
                        'email': user.email,
                        'password': user.password_hash
                    }
                }
            
            else:
                response = {
                    'status': 500
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
