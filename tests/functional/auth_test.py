def test_page(client):
    response = client.get('api/test')
    assert response.status_code == 200


def test_login(client):
    response = client.post('api/login', json={'email': 'teszt_email@gmail.com', 'password': 'psw'})
    assert response.status_code == 200
    assert 'token' in response.json


def get_auth_token(client):
    response = client.post('api/login', json={'email': 'teszt_email@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_login_get(client):
    response = client.get('api/login', json={'email': 'teszt_email@gmail.com', 'password': 'psw'})
    assert response.status_code == 405


def test_register(client):
    response = client.post('api/register', json={'email': 'testuser99@gmail.com', 'password': 'psw', 'role': '1',
                                                 'name': 'Test'})
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'
    userid = response.json['data']['userid']

    response = client.post('api/register', json={'email': 'testuser99@gmail.com', 'password': 'psw', 'role': '1',
                                                 'name': 'Test'})
    assert response.status_code == 500
    assert response.json['error'] == 'User already exists'

    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post(f"/api/user/{userid}/remove", headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'User deleted successfully'



