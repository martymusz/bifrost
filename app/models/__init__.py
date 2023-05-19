from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from app.models.user import User
from app.models.connection import Connection
from app.models.table import Table
from app.models.column import Column
from app.models.task import Task
from app.models.metamodel import Metamodel

