from flask import flash, request
from app.models import Curso
from app import app

@app.route('/enroll', methods=['GET', 'POST'])
def enroll():
    if request.method == 'POST':
        result = request.get_json()
        nome_curso = result['nome_curso']
        user_id = result['user_id']
        error = []

    if not nome_curso:
        flash('Por favor, inclua o curso!')
        error.append('Sem curso selecionado')
    if not user_id:
        flash('Por favor, entre antes de se inscrever!')
        error.append('Usuário não cadastrado')

    if error == []:
        Curso.course_enroll(nome_curso, user_id)
        return {'confirmed': 1}

    return {'confirmed': 0, 'errors': error}
