from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from flask import Flask
from flask_cors import CORS
import logging
from app.api import api
from app.models import db
from app.utils import create_task_executed, create_task_failed, restore_tasks, scheduler


def create_app():
    app = Flask(__name__)

    logger = logging.getLogger('app')
    logger.setLevel(logging.DEBUG)
    file_handler = logging.FileHandler('app.log')
    logger.addHandler(file_handler)

    app.config.from_pyfile('config.py')



    db.init_app(app)
    scheduler.init_app(app)
    scheduler.start()

    with app.app_context():
        db.create_all()
        task_executed = create_task_executed(app)
        task_failed = create_task_failed(app)
        scheduler.add_listener(task_executed, EVENT_JOB_EXECUTED)
        scheduler.add_listener(task_failed, EVENT_JOB_ERROR)
        restore_tasks(app)

    CORS(app, resources={r'/api/*': {'origins': ['http://localhost:3000']}})
    app.register_blueprint(api)

    return app
