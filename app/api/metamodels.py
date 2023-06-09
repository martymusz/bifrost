from flask import jsonify, request, current_app
from sqlalchemy import DDL, join
from app.api import api
from app.models import db, Table
from app.middleware import login_required
from app.models.connection import Connection
from app.models.metamodel import Metamodel
from datetime import datetime


@api.route('/metamodels', methods=['GET'])
@login_required
def get_all_metamodels():
    """
       Metamodellek lekérdezése.
       ---

        responses:
         200:
           description: OK
       """
    result = Metamodel.query.all()
    metamodels = sorted(result, key=lambda x: x.metamodel_id)
    return jsonify([metamodel.to_dict() for metamodel in metamodels]), 200


@api.route('/metamodels/add', methods=['POST'])
@login_required
def add_metamodel():
    """
        Metamodell létrehozása.
        ---
        parameters:
        - name: metamodel_name
        - name: metamodel_schema
        - name: target_connection_id
        - name: target_connection_name

        responses:
          201:
            description: OK
        """
    data = request.json
    metamodel_name = data['metamodel_name']
    metamodel_schema = data['metamodel_schema']
    target_connection_id = data['target_connection_id']
    target_connection = Connection.get_by_id(target_connection_id)
    target_connection_name = target_connection.bind_key
    creation_timestamp = datetime.now()

    try:
        new_metamodel = Metamodel.add_new_metamodel(metamodel_name=metamodel_name,
                                                    metamodel_schema=metamodel_schema,
                                                    target_connection_id=target_connection_id,
                                                    target_connection_name=target_connection_name,
                                                    creation_timestamp=creation_timestamp)
        db.session.add(new_metamodel)
        db.session.commit()
        target = Connection.get_by_id(data['target_connection_id'])
        engine = db.engines[target.bind_key]
        create_schema = DDL(f"CREATE SCHEMA IF NOT EXISTS {data['metamodel_schema']}")

        with engine.connect() as connection:
            try:
                connection.execute(create_schema)
                connection.commit()

            except Exception as e:
                connection.rollback()
                current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                         'Schema creation failed on target database' + '-' + str(e))
                return jsonify({'error': 'Schema creation failed on target database'}), 500

            finally:
                connection.close()

    except Exception as e:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Metamodel creation failed' + '-' + str(e))
        return jsonify({'error': 'Metamodel creation failed'}), 500

    else:
        current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                'Metamodel created successfully')
        return jsonify({'message': 'Metamodel created successfully', 'data': new_metamodel.to_dict()}), 200


@api.route('/metamodel/<int:metamodel_id>/remove', methods=['POST'])
@login_required
def remove_metamodel(metamodel_id):
    """
        Metamodell eltávolítása.
        ---
        parameters:
        - name: metamodel_id

        responses:
          201:
            description: OK
        """
    try:
        metamodel = Metamodel.get_by_id(metamodel_id=metamodel_id)
        tables = Table.query.all()
        for table in tables:
            if table.metamodel_id == metamodel.metamodel_id:
                current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                         'Error removing metamodel because of dependency' + ' ')
                return jsonify({'error': 'Cannot remove metamodel because there are tables referring'}), 500
        else:
            db.session.delete(metamodel)
            db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Metamodel not found')
        return jsonify({'error': 'Metamodel not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error removing metamodel' + ' ' + str(e))
        return jsonify({'error': 'Error removing metamodel'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Metamodel removed successfully')
        return jsonify({'message': 'Metamodel removed successfully'}), 201


@api.route('/metamodel/<int:metamodel_id>/update', methods=['POST'])
@login_required
def update_metamodel(metamodel_id):
    """
        Metamodell módosítása.
        ---
        parameters:
        - name: metamodel_id
        - name: metamodel_name

        responses:
          201:
            description: OK
        """
    try:
        data = request.json
        metamodel_name = data['metamodel_name'],
        metamodel = Metamodel.get_by_id(metamodel_id)
        metamodel.update(metamodel_name=metamodel_name)
        db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Metamodel not found')
        return jsonify({'error': 'Metamodel not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error updating metamodel' + ' ' + str(e))
        return jsonify({'error': 'Error updating metamodel'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Metamodel updated successfully')
        return jsonify({'message': 'Metamodel updated successfully'}), 201
