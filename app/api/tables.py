import psycopg2
import sqlalchemy
from flask import jsonify, request, current_app
from sqlalchemy import text
from app.api import api
from app.models import db
from app.models.connection import Connection
from app.models.metamodel import Metamodel
from app.models.table import Table
from app.models.column import Column
from app.middleware import login_required
from app.utils import table_mapper, sqlmapper, load_scd, init_load_dim, init_load_view, init_load_fact
from datetime import datetime


@api.route('/tables', methods=['GET'])
@login_required
def get_all_tables():
    tables = Table.query.all()
    return jsonify([table.to_dict() for table in tables]), 200


@api.route('/tables/add', methods=['POST'])
@login_required
def add_table():
    data = request.json
    metamodel = Metamodel.get_by_id(metamodel_id=data['metamodel_id'])
    columns = data['columns']
    joins = data['joins']
    filters = data['filters']
    column_names = ''

    try:
        new_table = Table.add_new_table(table_name=data['table_name'], table_type=data['table_type'],
                                        dimension_type=data['dimension_type'], dimension_key=data['dimension_key'],
                                        metamodel_id=metamodel.metamodel_id,
                                        source_connection_id=data['source_connection_id'], columns='', sql='')

        db.session.add(new_table)

        for column in columns:
            new_column = Column.add_new_column(column_name=column['column_name'], column_type=column['column_type'],
                                               table_id=new_table.table_id)
            db.session.add(new_column)
            if len(column_names) == 0:
                column_names = new_column.column_name
            else:
                column_names = column_names + new_column.name

        new_table.columns = column_names
        sql = sqlmapper(source_table=data['source_table'], columns=columns, joins=joins, filters=filters)
        new_table.modify_sql(sql=sql)
        metamodel.add_new_table(table_name=new_table.table_name)
        db.session.commit()

    except (sqlalchemy.exc.IntegrityError, psycopg2.errors.DuplicateTable, sqlalchemy.exc.ProgrammingError) as e:
        db.session.rollback()
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + str(e))
        return jsonify({'message': 'Table creation failed because table already exists'}), 500

    except ConnectionError as e:
        db.session.rollback()
        current_app.logger.error(
            datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table creation connection problem' + str(e))
        return jsonify({'message': 'Table creation failed due to connection issues'}), 500

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table creation failed' + str(e))
        return jsonify({'message': 'Table creation failed due to server error'}), 500

    else:
        try:
            target_table = table_mapper(table_name=data['table_name'], source_columns=columns,
                                        schema=metamodel.metamodel_schema, table_type=new_table.table_type)

            target = Connection.get_by_id(connection_id=metamodel.target_connection_id)
            target_engine = db.get_engine(bind_key=target.bind_key)
            with target_engine.connect() as connection:
                target_table.create(bind=target_engine)
                connection.commit()

        except (sqlalchemy.exc.IntegrityError, psycopg2.errors.DuplicateTable, sqlalchemy.exc.ProgrammingError) as e:
            db.session.rollback()
            current_app.logger.error(
                'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + str(e))
            return jsonify({'message': 'Target table already exists in the database'}), 500

        except ConnectionError as e:
            db.session.rollback()
            current_app.logger.error(
                datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table creation connection problem' + str(e))
            return jsonify({'message': 'Table creation failed due to connection issues'}), 500

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(
                datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table creation failed' + str(e))
            return jsonify({'message': 'Table creation failed due to server error'}), 500

        else:
            current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table created successfully')
            return jsonify({'message': 'Table created successfully', 'Table': new_table.to_dict()}), 201


@api.route('/table/init/<int:table_id>', methods=['POST'])
@login_required
def init_table(table_id):
    try:
        table = Table.get_by_id(table_id=table_id)

    except IndexError:
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
            current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                     'Load failed due to connection issues')
            return jsonify({'message': 'Load failed due to connection issues'}), 500

        except Exception as e:
            current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                     'Load failed due to server error' + str(e))
            return jsonify({'message': 'Load failed due to server error'}), 500

        else:
            current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table loaded successfully')
            return jsonify({'message': 'Load completed successfully'}), 201


@api.route('/table/load/<int:table_id>', methods=['POST'])
@login_required
def load_table(table_id):
    try:
        table = Table.get_by_id(table_id=table_id)

    except IndexError:
        return jsonify({'message': 'Table not found'}), 404

    else:
        source_connection = Connection.get_by_id(connection_id=table.source_connection_id)
        source_engine = db.get_engine(bind_key=source_connection.bind_key)
        metamodel = Metamodel.get_by_id(metamodel_id=table.metamodel_id)
        target_connection = Connection.get_by_id(connection_id=metamodel.target_connection_id)
        target_engine = db.get_engine(bind_key=target_connection.bind_key)
        full_table_name = metamodel.metamodel_schema + '.' + table.table_name
        target_sql = sqlmapper(full_table_name)

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
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Load failed due to connection issues')
        return jsonify({'message': 'Load failed due to connection issues'}), 500

    except Exception as e:
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Load failed due to server error' + str(e))
        return jsonify({'message': 'Load failed due to server error'}), 500

    else:
        print("Load completed successfully")
        return jsonify({'message': 'Load completed successfully'}), 201


@api.route('/table/<int:table_id>/remove', methods=['POST'])
@login_required
def remove_table(table_id):
    try:
        table = Table.get_by_id(table_id=table_id)
        db.session.delete(table)
        db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table not found')
        return jsonify({'error': 'Table not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error removing table' + ' ' + str(e))
        return jsonify({'error': 'Error removing table'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table removed successfully')
        return jsonify({'message': 'Table removed successfully'}), 201


@api.route('/table/<int:table_id>/update', methods=['POST'])
@login_required
def update_table(table_id):
    try:
        data = request.json
        sql = data['sql'],
        table = Table.get_by_id(table_id)
        table.modify_sql(sql=sql)
        db.session.commit()

    except IndexError:
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table not found')
        return jsonify({'error': 'Table not found'}), 404

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                 'Error updating metamodel' + ' ' + str(e))
        return jsonify({'error': 'Error updating metamodel'}), 500

    else:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Table updated successfully')
        return jsonify({'message': 'Table updated successfully'}), 201
