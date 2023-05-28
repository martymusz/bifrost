from app.models import Connection


def test_new_connection():
    connection = Connection.add_new_connection(bind_key='bind_key', database_uri='database_uri',
                                               database_name='database_name', default_schema='default_schema',
                                               driver_name='driver_name')
    assert connection.connection_id != ''
    assert connection.bind_key == 'bind_key'
    assert connection.database_uri == 'database_uri'
    assert connection.database_name == 'database_name'
    assert connection.default_schema == 'default_schema'
    assert connection.driver_name == 'driver_name'


def test_update_connection():
    connection = Connection.add_new_connection(bind_key='bind_key', database_uri='database_uri',
                                               database_name='database_name', default_schema='default_schema',
                                               driver_name='driver_name')
    connection.update(bind_key='changed', database_uri='changed',
                                               database_name='database_name', default_schema='default_schema',
                                               driver_name='driver_name')
    assert connection.bind_key == 'changed'
    assert connection.database_uri == 'changed'
