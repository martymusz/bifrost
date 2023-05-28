from datetime import datetime
from flask import jsonify, current_app
from flask_apscheduler import APScheduler
from sqlalchemy import text
from app.utils import sqlmapper
from app.utils.init_load import init_load_view, init_load_dim, init_load_fact
from app.models import Metamodel, Table, Connection, db, Task
from app.utils.scd import load_scd


scheduler = APScheduler()


def create_task_executed(app):
    def task_executed(event):
        with app.app_context():
            task_id = event.job_id
            task = Task.get_by_id(task_id)
            last_run_time = event.scheduled_run_time
            task.modify_last_run(last_run_time)
            task.modify_status("Successful")
            db.session.commit()
            current_app.logger.info(
                'INFO ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Job ' + task_id
                + ' executed successfully')
    return task_executed


def create_task_failed(app):
    def task_error(event):
        with app.app_context():
            task_id = event.job_id
            task = Task.get_by_id(task_id)
            last_run_time = event.scheduled_run_time
            task.modify_last_run(last_run_time)
            task.modify_status("Failed")
            db.session.commit()
            print(event.scheduled_run_time, last_run_time, event.exception, task.to_dict())
            current_app.logger.error(
                'ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Job ' + task_id
                + ' failed to execute ' + event.exception)
    return task_error


def add_new_task(task_id, func, trigger, **kwargs):
    scheduler.add_job(id=task_id, func=func, trigger=trigger, **kwargs)


def remove_task(task_id):
    scheduler.remove_job(task_id)


def scheduled_load_job(table_id, app):
    with app.app_context():
        current_app.logger.info('INFO ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Scheduled load - Job triggered')
        try:
            table = Table.get_by_id(table_id=table_id)

        except IndexError:
            current_app.logger.info(
                'ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Scheduled load - Table not found')
            return jsonify({'message': 'Table not found'}), 404

        else:
            source_connection = Connection.get_by_id(connection_id=table.source_connection_id)
            source_engine = db.get_engine(bind_key=source_connection.bind_key)
            metamodel = Metamodel.get_by_id(metamodel_id=table.metamodel_id)
            target_connection = Connection.get_by_id(connection_id=metamodel.target_connection_id)
            target_engine = db.get_engine(bind_key=target_connection.bind_key)
            full_table_name = metamodel.metamodel_schema + '.' + table.table_name
            target_sql = sqlmapper(source_table=full_table_name, columns=[], joins=[], filters=[])

        try:
            if table.table_type == 'dimension' and table.dimension_type == 'versioned':
                load_scd(source_engine=source_engine, target_engine=target_engine, dimension_key=table.dimension_key,
                         target_sql=target_sql, source_sql=table.sql, target_table=table.table_name)

            elif table.table_type == 'dimension' and table.dimension_type != 'versioned':
                init_load_dim(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                              target_table=table.table_name)

            elif table.table_type == 'view':
                init_load_view(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                               target_table=table.table_name)
            elif table.table_type == 'fact':
                init_load_fact(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                               target_table=table.table_name)

        except ConnectionError:
            current_app.logger.error('ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                     'Load failed due to connection issues')
            return jsonify({'message': 'Load failed due to connection issues'}), 500

        except Exception as e:
            current_app.logger.error('ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                     'Load failed due to server error' + str(e))
            return jsonify({'message': 'Load failed due to server error'}), 500

        else:
            current_app.logger.info(
                'INFO ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table loaded successfully')
            return jsonify({'message': 'Load completed successfully'}), 201


def scheduled_init_job(table_id, app):
    with app.app_context():
        current_app.logger.info('INFO ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Scheduled init - Job triggered')
        try:
            table = Table.get_by_id(table_id=table_id)

        except IndexError:
            current_app.logger.info(
                'ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Scheduled load - Table not found')
            return jsonify({'message': 'Table not found'}), 404

        else:
            source_connection = Connection.get_by_id(connection_id=table.source_connection_id)
            source_engine = db.get_engine(bind_key=source_connection.bind_key)
            metamodel = Metamodel.get_by_id(metamodel_id=table.metamodel_id)
            target_connection = Connection.get_by_id(connection_id=metamodel.target_connection_id)
            target_engine = db.get_engine(bind_key=target_connection.bind_key)

            try:

                full_table_name = metamodel.metamodel_schema + '.' + table.table_name
                truncate = text(f"TRUNCATE TABLE {full_table_name}")
                with target_engine.connect() as connection:
                    connection.execute(truncate)
                    connection.commit()
                    connection.close()

                if table.table_type == 'view':
                    init_load_view(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                                   target_table=table.table_name)

                elif table.table_type == 'dimension':
                    init_load_dim(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                                  target_table=table.table_name)

                elif table.table_type == 'fact':
                    init_load_fact(source_engine=source_engine, source_sql=table.sql, target_engine=target_engine,
                                   target_table=table.table_name)

            except ConnectionError:
                current_app.logger.error('ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                         'Load failed due to connection issues')
                return jsonify({'message': 'Load failed due to connection issues'}), 500

            except Exception as e:
                current_app.logger.error('ERROR ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                         'Load failed due to server error' + str(e))
                return jsonify({'message': 'Load failed due to server error'}), 500

            else:
                current_app.logger.info(
                    'INFO ' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table loaded successfully')
                return jsonify({'message': 'Load completed successfully'}), 201


def restore_tasks(app):
    with app.app_context():
        tasks = Task.query.all()
        for task in tasks:
            if task.task_trigger == "date":
                if task.load_type == 'regular':
                    add_new_task(task_id=str(task.task_id), func=scheduled_load_job, trigger=task.task_trigger,
                                 run_date=task.start_date,
                                 kwargs={'table_id': task.table_id, 'app': app})

                elif task.load_type == 'init':
                    add_new_task(task_id=str(task.task_id), func=scheduled_init_job, trigger=task.task_trigger,
                                 run_date=task.start_date,
                                 kwargs={'table_id': task.table_id, 'app': app})

            if task.task_trigger == "interval":

                if task.load_type == 'regular':
                    add_new_task(task_id=str(task.task_id), func=scheduled_load_job, trigger=task.task_trigger,
                                 days=int(task.task_schedule), start_date=task.start_date, end_date=task.end_date,
                                 kwargs={'table_id': task.table_id, 'app': app})
                elif task.load_type == 'init':
                    add_new_task(task_id=str(task.task_id), func=scheduled_init_job, trigger=task.task_trigger,
                                 days=int(task.task_schedule), start_date=task.start_date, end_date=task.end_date,
                                 kwargs={'table_id': task.table_id, 'app': app})
