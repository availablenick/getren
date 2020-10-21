#hattps://flask-login.readthedocs.io/en/latest/#installation
#https://github.com/schoolofcode-me/web_blog/blob/master/src/app.py

from flask import flash, request, render_template, redirect, url_for
from app.models import User
from app import app
import re

@app.route('/register', methods = ['GET', 'POST'])
def register():
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        password_confirm = result['password_confirm']
        error = []

        if not email:
            flash('É necessário incluir email')
            error.append("Sem email")
        if not password:
            flash('É necessário incluir senha')
            error.append("Sem senha")
        if len(password) < 8:
            flash('A senha necessita de pelo menos 8 caracteres')
            error.append("Senha curta")
        if not re.search(r'[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+(\.\w+)?$', email):
            flash('Esse email é inválido')
            error.append("Email inválido")
        user = User.query.filter_by(email=email).first()
        if user is not None:
            flash('Esse email já está cadastrado.')
            error.append("Email cadastrado")
        if password_confirm != password:
            flash('As senhas não coincidem.')
            error.append("Confirmacao errada")
        if error == []:
            User.register(email,password)
            #return redirect(url_for('profile'))
            return {'confirmed': 1}
    return {'confirmed': 0, 'errors': error}

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        password = result['password']
        if not email:
            flash('Insira um email.')
            return {'confirmed': 0, 'error': "Sem email"}
        user = User.query.filter_by(email=email).first()
        if user is None:
            flash('Esse email não está registrado.')
            error = "Não registrado"
        elif not user.check_password(password):
            flash('O usuário/senha está incorreto/a.')
            error = "Senha errada"
        else:
            #return redirect(url_for('profile'))
            return {'confirmed': 1}
    return {'confirmed': 0, 'error': error}

#@app.route('/logout')
#def logout():
    # Avisa o react que foi deslogado
    # return redirect(url_for('index'))
