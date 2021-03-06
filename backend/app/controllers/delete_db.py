from flask import request, make_response

from app import app, db
from app.models import User, Course

@app.route('/erase_db', methods=['GET'])
def erase():
    tables = ['public.user', 'course', 'video']
    for table in tables:
        query = 'TRUNCATE TABLE ' + table + ' RESTART IDENTITY CASCADE'
        db.engine.execute(query)
    return {}, 200
    