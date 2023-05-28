def get_auth_token(client):
    response = client.post('api/login', json={'email': 'teszt_email@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_connections(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/connections', headers=headers)
    assert response.status_code == 200


def test_get_all_tables_for_connection(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/connection/1/tables', headers=headers)
    assert response.status_code == 200


def test_add_modify_remove_connection(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/connections/add', headers=headers, json={'database_uri': 'postgresql://qabhuzsw'
                                                                                          ':Q2dT8UyL04HM-YJwH39EvqoUGJ_7BJnw@horton.db.elephantsql.com/qabhuzsw?options=-c%20search_path=salesdb',
                                                                          'database_name': 'qabhuzsw',
                                                                          'bind_key': 'teszt',
                                                                          'default_schema': 'tesztdb',
                                                                          'driver_name': 'psycopg2'})
    assert response.status_code == 201
    assert response.json['message'] == 'Connection created successfully'
    connection_id = response.json['data']['connection_id']

    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post(f"/api/connection/{connection_id}/update", headers=headers, json={'database_uri': 'teszt',
                                                                         'database_name': 'qabhuzsw',
                                                                          'bind_key': 'teszt',
                                                                          'default_schema': 'tesztdb',
                                                                          'driver_name': 'psycopg2'})
    assert response.status_code == 201
    assert response.json['message'] == 'Connection updated successfully'

    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post(f"/api/connection/{connection_id}/remove", headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Connection removed successfully'



