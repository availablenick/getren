#hattps://flask-login.readthedocs.io/en/latest/#installation
#https://github.com/schoolofcode-me/web_blog/blob/master/src/app.py

from flask import flash, request, render_template, redirect
from app.models import User
from app import app

# @app.route('/login', methods = ['GET', 'POST'])
# def login():
#     email = request.form['email']
#     password = request.form['password']

#     get_db 

#     return render_template("profile.html", email=session['email'])

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
        user = User.query.filter_by(email=email).first()
        if user is not None:
            flash('Esse email já está cadastrado.')
            error = True
        if password_confirm != password:
            flash('As senhas não coincidem.')
            error = True

        if not error:
            User.register(email,password)
            return redirect('/profile')
    return render_template('register.html')
