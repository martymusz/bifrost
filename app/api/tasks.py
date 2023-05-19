from datetime import datetime
from flask import request, jsonify, current_app
from app.middleware import login_required
from app.models.task import Task
from app.api import api
from app.models import Table
from app.utils.schedule import add_new_task, remove_task, scheduler, scheduled_init_job, scheduled_load_job


@api.route('/tasks', methods=['GET'])
@login_required
def get_all_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks]), 200


@api.route('/tasks/add', methods=['POST'])
@login_required
def create_task():
    data = request.get_json()
    table_id = data['table_id']
    load_type = data['load_type']
    task_trigger = data['task_trigger']
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M')
    if task_trigger == 'interval':
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M')
        task_schedule = int(data['task_schedule'])
    else:
        end_date = ''
        task_schedule = ''

    try:

        table = Table.get_by_id(table_id=table_id)

    except IndexError:
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Schedule - Table not found')
        return jsonify({'error': 'Table not found'}), 404

    else:

        try:

            task = Task.add_new_task(table_id=table_id, load_type=load_type, task_trigger=task_trigger,
                                     task_schedule=task_schedule, start_date=start_date, end_date=end_date)

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
            print(e)

        else:
            current_app.logger.info(
                datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task scheduled successfully')
            return jsonify({'message': 'Task scheduled successfully'}), 201


@api.route('/task/<int:task_id>/unschedule', methods=['POST'])
@login_required
def remove_scheduled_task(task_id):
    try:
        task = Task.get_by_id(task_id)
        task.unschedule()

    except IndexError:
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task not found')
        return jsonify({'error': 'Task not found'}), 404

    else:
        try:
            remove_task(task_id=str(task_id))

        except Exception as e:
            current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task unschedule error')
            return jsonify({'error': 'Error unscheduling task'}), 500

        else:
            current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Task unscheduled')
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
