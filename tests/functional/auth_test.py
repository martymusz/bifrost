def test_page(client):
    response = client.get('api/test')
    assert response.status_code == 200


def test_login(client):
    response = client.post('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    assert response.status_code == 200
    assert 'token' in response.json


def test_login_get(client):
    response = client.get('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    assert response.status_code == 405


def test_register(client):
    response = client.post('api/register', json={'email': 'testuser@gmail.com', 'password': 'psw', 'role': '1',
                                                 'name': 'Test'})
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'


def test_register_exists(client):
    response = client.post('api/register', json={'email': 'testuser@gmail.com', 'password': 'psw', 'role': '1',
                                                 'name': 'Test'})
    assert response.status_code == 500
    assert response.json['error'] == 'User already exists'
