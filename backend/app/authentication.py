#hattps://flask-login.readthedocs.io/en/latest/#installation
#https://github.com/schoolofcode-me/web_blog/blob/master/src/app.py

from flask import flash, request, render_template, redirect, url_for
from app.models import User
from app import app
import re

@app.route('/register', methods = ['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        error = False       

        if not email:
            flash('É necessário incluir email')
            error = True
        if not password:
            flash('É necessário incluir senha')
            error = True
        if len(password) < 8:
            flash('A senha necessita de pelo menos 8 caracteres')
            error = True
        if not re.search(r'[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+(\.\w+)?$', email):
            flash('Esse email é inválido')
            error = True
        user = User.query.filter_by(email=email).first()
        if user is not None:
            flash('Esse email já está cadastrado.')
            error = True
        if password_confirm != password:
            flash('As senhas não coincidem.')
            error = True
        if not error:
            User.register(email,password)
            return redirect(url_for('profile'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if not email:
            flash('Insira um email.')
            return render_template('login.html')
        user = User.query.filter_by(email=email).first()
        if user is None:
            flash('Esse email não está registrado.')
        elif not user.check_password(password):
            flash('O usuário/senha está incorreto/a.')
        else:
            return redirect(url_for('profile'))
    return render_template('login.html')

#@app.route('/logout')
#def logout():
    # Avisa o react que foi deslogado
    # return redirect(url_for('index'))
