from flask import Blueprint, request, make_response

from .. import db
from ..models.user import User
from ..models.course import Course

bp = Blueprint('delete_db', __name__)

@bp.route('/erase_db', methods=['GET'])
def erase():
    tables = ['public.user', 'course', 'video']
    for table in tables:
        query = 'TRUNCATE TABLE ' + table + ' RESTART IDENTITY CASCADE'
        db.engine.execute(query)
    return {}, 200
