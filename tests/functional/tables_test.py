def get_auth_token(client):
    response = client.post('api/login', json={'email': 'teszt_email@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_tables(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/tables', headers=headers)
    assert response.status_code == 200


def test_load_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/table/load/95', headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Load completed successfully'


def test_init_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/table/init/95', headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Load completed successfully'


def test_add_modify_remove_table(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/tables/add', headers=headers,
                           json={'table_name': 'unit_test_table', 'table_type': 'view',
                                 'dimension_type': '', 'dimension_key': '',
                                 'metamodel_id': '38', 'filters': [],
                                 'source_connection_id': '1', 'columns': [
                                   {'column_name': 'dkod', 'column_type': 'Integer', 'key': 'dolgozo_dkod',
                                    'table_name': 'dolgozo'}],
                                 'source_table': 'dolgozo', 'joins': []})

    assert response.status_code == 201
    assert response.json['message'] == 'Table created successfully'
    table_id = response.json['data']['table_id']
    print(table_id)

    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post(f"/api/table/{table_id}/update", headers=headers, json={'sql': 'select * from dolgozo'})
    assert response.status_code == 201
    assert response.json['message'] == 'Table updated successfully'

    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post(f"/api/table/{table_id}/remove", headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Table removed successfully'
