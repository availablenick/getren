import os

from flask import Blueprint, request, make_response, jsonify
from flask_mail import Message
from flask_cors import cross_origin

from .utils import (validate_password, generate_token, jsonify_user,
    error_response, decode_user, SECRET_KEY)
from .. import mail

GETREN_MAIL = os.environ.get('GETREN_MAIL')

bp = Blueprint('contact', __name__)

@bp.route('/contact', methods=['POST'])
def contact():
    if request.method == 'POST':
        result = request.get_json()
        email = result['email']
        name = result['name']
        subject = result['subject']
        message = result['message']
        msg = Message(f"Contato - Getren ({subject})", recipients=[GETREN_MAIL])
        msg.body = f"\nEnviado por {name}:\n\n\"{message}\"\n\nRetornar para {email}."
        try:
            mail.send(msg)
            return {}, 200
        except Exception as e:
            return error_response('Email não enviado', 500)