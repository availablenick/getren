#hattps://flask-login.readthedocs.io/en/latest/#installation
#https://github.com/schoolofcode-me/web_blog/blob/master/src/app.py

from flask import Flask, request, session, render_template

@getren.route('/login', methods = ['GET', 'POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    if User.login_valid(email, password):
        User.login(email)
    else:
        session['email'] = None

    return render_template('login.html')

@getren.route('/register', methods = ['GET'])
def register():
    pass
