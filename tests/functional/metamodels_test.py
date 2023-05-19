def get_auth_token(client):
    response = client.post('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_metamodels(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/metamodels', headers=headers)
    assert response.status_code == 200


def test_add_metamodel_incorrect(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/metamodels/add', headers=headers, json={'metamodel_name': 'metamodel_name',
                                                                         'metamodel_schema': 'metamodel_schema',
                                                                         'target_connection_id': '99'})
    assert response.status_code == 500


def test_add_metamodel(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/metamodels/add', headers=headers, json={'metamodel_name': 'metamodel_name',
                                                                         'metamodel_schema': 'metamodel_schema',
                                                                         'target_connection_id': '1'})
    assert response.status_code == 200
    assert response.json['message'] == 'Metamodel created successfully'
