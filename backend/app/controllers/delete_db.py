from flask import request, make_response

from app import app, db
from app.models import User, Course

@app.route('/erase_db', methods=['GET'])
def erase():
    User.query.delete()
    Course.query.delete()
    db.session.commit()
    return {}, 200
    