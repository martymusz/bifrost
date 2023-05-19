def get_auth_token(client):
    response = client.post('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_users(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/users', headers=headers)
    assert response.status_code == 200


def test_get_all_users_post(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/users', headers=headers)
    assert response.status_code == 405


def test_change_user_not_exists(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/user/0/status', headers=headers, json={'action': 'deactivate'})
    assert response.status_code == 404
    assert response.json['error'] == 'User not found'


def test_change_status_deact(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/user/1/status', headers=headers, json={'action': 'deactivate'})
    assert response.status_code == 200
    assert response.json['message'] == 'User status changed successfully'


def test_change_status_act(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/user/1/status', headers=headers, json={'action': 'activate'})
    assert response.status_code == 200
    assert response.json['message'] == 'User status changed successfully'


def test_change_role(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/user/1/role', headers=headers, json={'role': '1'})
    assert response.status_code == 200
    assert response.json['message'] == 'User role changed successfully'

