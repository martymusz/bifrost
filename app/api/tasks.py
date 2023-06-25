from datetime import datetime
from flask import request, jsonify, current_app
from app.models import db, User
from app.middleware import login_required
from app.models.task import Task
from app.api import api
from app.models import Table
from app.utils.load import add_new_task, remove_task, scheduler, scheduled_init_job, scheduled_load_job


@api.route('/tasks', methods=['GET'])
@login_required
def get_all_tasks():
    result = Task.query.all()
    tasks = sorted(result, key=lambda x: x.task_id)
    return jsonify([task.to_dict() for task in tasks]), 200


@api.route('/tasks/add', methods=['POST'])
@login_required
def create_task():
    """
        Töltő létrehozása.
        ---
        parameters:
        - name: table_id
        - name: owner_id
        - name: load_type
        - name: task_trigger
        - name: start_date
        - name: end_date
        - name: task_schedule

        responses:
          201:
            description: OK
        """
    data = request.get_json()
    table_id = data['table_id']
    owner_id = data['owner_id']
    load_type = data['load_type']
    task_trigger = data['task_trigger']
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M')
    if task_trigger == 'interval':
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M')
        task_schedule = int(data['task_schedule'])
    else:
        end_date = start_date
        task_schedule = 0

    try:
        owner = User.get_by_userid(owner_id)
        table = Table.get_by_id(table_id=table_id)

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Schedule - Table not found')
        return jsonify({'error': 'Table not found'}), 404

    else:

        try:

            task = Task.add_new_task(table_id=table_id, owner_id=owner_id, owner_name=owner.name,
                                     load_type=load_type, task_trigger=task_trigger, task_schedule=task_schedule,
                                     start_date=start_date, end_date=end_date, table_name=table.table_name)
            db.session.add(task)
            db.session.commit()

            if task_trigger == "date":

                if load_type == 'regular':
                    add_new_task(task_id=str(task.task_id), func=scheduled_load_job, trigger='date',
                                 run_date=task.start_date,
                                 kwargs={'table_id': table_id, 'app': current_app._get_current_object()})

                elif load_type == 'init':
                    add_new_task(task_id=str(task.task_id), func=scheduled_init_job, trigger='date',
                                 run_date=task.start_date,
                                 kwargs={'table_id': table_id, 'app': current_app._get_current_object()})

            if task_trigger == "interval":

                if load_type == 'regular':
                    add_new_task(task_id=str(task.task_id), func=scheduled_load_job, trigger='interval',
                                 minutes=task_schedule, start_date=start_date, end_date=end_date,
                                 kwargs={'table_id': table_id, 'app': current_app._get_current_object()})
                elif load_type == 'init':
                    add_new_task(task_id=str(task.task_id), func=scheduled_init_job, trigger='interval',
                                 minutes=task_schedule, start_date=start_date, end_date=end_date,
                                 kwargs={'table_id': table_id, 'app': current_app._get_current_object()})

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(
                'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task not created' + str(e))
            return jsonify({'error': 'Task not created'}), 500

        else:
            current_app.logger.info(
                'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task scheduled successfully')
            return jsonify({'message': 'Task scheduled successfully', 'data': task.to_dict()}), 201


@api.route('/task/<int:task_id>/remove', methods=['POST'])
@login_required
def remove_scheduled_task(task_id):
    """
        Töltő törlése.
        ---
        parameters:
        - name: task_id

        responses:
          201:
            description: OK
        """
    try:
        task = Task.get_by_id(task_id)
        db.session.delete(task)
        db.session.commit()

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task not found')
        return jsonify({'error': 'Task not found'}), 404

    else:
        try:
            remove_task(task_id=str(task_id))

        except Exception:
            current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task unscheduled')
            return jsonify({'message': 'Task unscheduled successfully'}), 201

        else:
            current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task unscheduled')
            return jsonify({'message': 'Task unscheduled successfully'}), 201


@api.route('/tasks/all', methods=['GET'])
@login_required
def get_all_tasks_schedule():
    jobs = scheduler.get_jobs()
    job_info = []
    for job in jobs:
        job_info.append({
            'id': job.id,
            'func': job.func.__name__,
            'trigger': str(job.trigger)
        })

    return jsonify(job_info)
