#hattps://flask-login.readthedocs.io/en/latest/#installation
#https://github.com/schoolofcode-me/web_blog/blob/master/src/app.py

from flask import Flask, request, session, render_template


app = Flask(__name__)

@app.route('/login', methods = ['GET', 'POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    get_db 

    return render_template("profile.html", email=session['email'])

@app.route('/register')
def register():
    pass


app.run(port = 5000)