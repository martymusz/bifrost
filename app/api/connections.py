from flask import jsonify, request, current_app
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError
from app.middleware import login_required
from app.api import api
from app.models import db
from app.models.connection import Connection
from datetime import datetime


@api.route('/connections', methods=['GET'])
@login_required
def get_all_connections():
    result = Connection.query.all()
    connections = sorted(result, key=lambda x: x.connection_id)
    return jsonify([connection.to_dict() for connection in connections]), 200


@api.route('/connections/add', methods=['POST'])
@login_required
def add_connection():
    data = request.json
    database_uri = data['database_uri'],
    database_name = data['database_name'],
    bind_key = data['bind_key'],
    default_schema = data['default_schema'],
    driver_name = data['driver_name']

    try:
        new_connection = Connection.add_new_connection(database_uri=database_uri,
                                                       database_name=database_name,
                                                       bind_key=bind_key, default_schema=default_schema,
                                                       driver_name=driver_name)
        db.session.add(new_connection)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection already exists')
        return jsonify({'error': 'Connection already exists'}), 500

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error creating connection' + ' ' + str(e))
        return jsonify({'error': 'Error creating connection'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection created successfully')
        return jsonify({'message': 'Connection created successfully', 'data': new_connection.to_dict()}), 201


@api.route('/connection/<int:connection_id>/remove', methods=['POST'])
@login_required
def remove_connection(connection_id):
    try:
        connection = Connection.get_by_id(connection_id=connection_id)
        db.session.delete(connection)
        db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection not found')
        return jsonify({'error': 'Connection not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error removing connection' + ' ' + str(e))
        return jsonify({'error': 'Error removing connection'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection removed successfully')
        return jsonify({'message': 'Connection removed successfully'}), 201


@api.route('/connection/<int:connection_id>/update', methods=['POST'])
@login_required
def update_connection(connection_id):
    try:
        data = request.json
        connection = Connection.get_by_id(connection_id=connection_id)
        database_uri = data['database_uri'],
        database_name = data['database_name'],
        bind_key = data['bind_key'],
        default_schema = data['default_schema'],
        driver_name = data['driver_name']

        connection.update(bind_key=bind_key, database_uri=database_uri, database_name=database_name,
                          default_schema=default_schema, driver_name=driver_name)

        db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection not found')
        return jsonify({'error': 'Connection not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error updating connection' + ' ' + str(e))
        return jsonify({'error': 'Error updating connection'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Connection updated successfully')
        return jsonify({'message': 'Connection updated successfully'}), 201


@api.route('/connection/<int:connection_id>/tables', methods=['POST'])
@login_required
def get_tables(connection_id):
    try:
        connection = Connection.get_by_id(connection_id)

    except IndexError:
        return jsonify({'message': 'Connection not found'}), 404

    else:
        engine = db.get_engine(bind_key=connection.bind_key)
        inspector = inspect(engine)
        tables = []
        for table_name in inspect(engine).get_table_names():
            columns = inspector.get_columns(table_name)
            for column in columns:
                tables.append({
                    'table_name': table_name,
                    'column': column['name'],
                    'nullable': column['nullable'],
                    'datatype': str(column['type']),
                    'key': table_name + '_' + column['name'],
                    'type': 'column'
                })
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table list retrieved')
        return jsonify(tables), 200
