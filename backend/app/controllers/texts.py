from flask import request, make_response, jsonify
from flask_cors import cross_origin

from .utils import is_valid_admin, error_response
from app import app
from app.models import Text

@app.route('/texts/<section>', methods = ['GET', 'POST', 'PUT'])
def text(section):
    sections = ['home', 'quem-somos', 'faq']
    if section not in sections:
        return error_response('Seção não existente', 400)

    text = Text.get_from_section(section)

    if request.method == 'GET':
        if text == None:
            return error_response('Seção não existente', 400)
        return {"body": text.body}, 200

    if is_valid_admin(request):
        if request.method == 'POST':        
            if text != None:
                return error_response('Seção já existente', 400)
            text = Text.add(section, request.get_json()['body'])
            if text == None:
                return error_response('Falha na inserção', 500)
            return {"body": text.body}, 200

        elif request.method == 'PUT':
            if text == None:
                return error_response('Seção não existente', 400)
            text = Text.update_body(section, request.get_json()['body'])
            if text == None:
                return error_response('Falha na atualização', 500)
            return {"body": text.body}, 200
    else:
        return error_response('Permissão negada', 401)


