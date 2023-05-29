from flask import Blueprint


api = Blueprint('api', __name__, url_prefix='/api')

from app.api import auth
from app.api import users
from app.api import connections
from app.api import metamodels
from app.api import tables
from app.api import tasks


