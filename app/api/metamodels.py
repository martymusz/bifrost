from flask import jsonify, request, current_app
from sqlalchemy import DDL
from app.api import api
from app.models import db
from app.middleware import login_required
from app.models.connection import Connection
from app.models.metamodel import Metamodel
from datetime import datetime


@api.route('/metamodels', methods=['GET'])
@login_required
def get_all_metamodels():
    result = Metamodel.query.all()
    metamodels = sorted(result, key=lambda x: x.metamodel_id)
    return jsonify([metamodel.to_dict() for metamodel in metamodels]), 200


@api.route('/metamodels/add', methods=['POST'])
@login_required
def add_metamodel():
    data = request.json

    try:
        new_metamodel = Metamodel.add_new_metamodel(metamodel_name=data['metamodel_name'],
                                                    metamodel_schema=data['metamodel_schema'],
                                                    target_connection_id=data['target_connection_id'])
        db.session.add(new_metamodel)
        db.session.commit()
        target = Connection.get_by_id(data['target_connection_id'])
        engine = db.get_engine(bind_key=target.bind_key)
        create_schema = DDL(f"CREATE SCHEMA IF NOT EXISTS {data['metamodel_schema']}")

        with engine.connect() as connection:
            try:
                connection.execute(create_schema)
                connection.commit()

            except Exception as e:
                connection.rollback()
                current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                         'Schema creation failed on target database' + '-' + str(e))
                return jsonify({'error': 'Schema creation failed on target database'}), 500

            finally:
                connection.close()

    except Exception as e:
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Metamodel creation failed' + '-' + str(e))
        return jsonify({'error': 'Metamodel creation failed'}), 500

    else:
        current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Metamodel created successfully')
        return jsonify({'message': 'Metamodel created successfully', 'Model': new_metamodel.to_dict()}), 200
