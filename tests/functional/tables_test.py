def get_auth_token(client):
    response = client.post('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_tables(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/tables', headers=headers)
    assert response.status_code == 200


def test_add_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/tables/add', headers=headers,
                           json={'table_name': 'table_test_unit', 'table_type': 'view',
                                 'dimension_type': '', 'dimension_key': '',
                                 'metamodel_id': '1',
                                 'source_connection_id': '1', 'columns': [
                                   {'column_name': 'dkod', 'column_type': 'Integer', 'key': 'dolgozo_dkod',
                                    'table_name': 'dolgozo'}],
                                 'source_table': 'dolgozo', 'joins': []})
    assert response.status_code == 201
    assert response.json['message'] == 'Table created successfully'


def test_add_table_duplicate(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/tables/add', headers=headers,
                           json={'table_name': 'table_test_unit', 'table_type': 'view',
                                 'dimension_type': '', 'dimension_key': '',
                                 'metamodel_id': '1',
                                 'source_connection_id': '1', 'columns': [
                                   {'column_name': 'dkod', 'column_type': 'Integer', 'key': 'dolgozo_dkod',
                                    'table_name': 'dolgozo'}],
                                 'source_table': 'dolgozo', 'joins': []})
    assert response.status_code == 500


def test_load_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/table/load/13', headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Load completed successfully'


def test_init_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/table/init/45', headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Load completed successfully'
