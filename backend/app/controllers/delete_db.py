from flask import request, make_response
from app.models import User
from app import app, db

@app.route('/erase_db', methods=['GET'])
def erase():
    User.query.delete()
    db.session.commit()
    return {}, 200
    