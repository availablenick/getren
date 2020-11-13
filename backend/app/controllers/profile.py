from flask import flash, request, render_template, redirect, url_for
from app.models import User
from app import app
import datetime

@app.route('/dados', methods=['GET', 'POST'])
def dados():
    if request.method == 'POST':
        result = request.get_json()
        nome = result['nome']
        data_nascimento = result['data_nascimento']
        data_nascimento = datetime.datetime.strptime(data_nascimento, '%Y-%m-%d')
        cidade = result['cidade']
        estado = result['estado']
        profissao = result['profissao']
        email = result['email']
        user = User.update_data(email, nome, data_nascimento, estado, cidade, profissao)
        if user is not None:
            return {'status': 200}

    return {'status': 500}

