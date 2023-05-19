def get_auth_token(client):
    response = client.post('api/login', json={'email': 'nyuszika@gmail.com', 'password': 'psw'})
    token = response.json['token']
    return token


def test_get_all_tasks(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.get('/api/tasks', headers=headers)
    assert response.status_code == 200


def test_add_task(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/tasks/add', headers=headers, json={'table_id': '1', 'load_type': 'regular',
                                                                    'task_trigger': 'interval', 'task_schedule': '1',
                                                                    'start_date': '2023-05-16 20:52',
                                                                    'end_date': '2023-05-16 21:59'})
    assert response.status_code == 201
    assert response.json['message'] == 'Task scheduled successfully'


def test_add_task_incorrect(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/tasks/add', headers=headers, json={'table_id': '999', 'load_type': 'regular',
                                                                    'task_trigger': 'interval', 'task_schedule': '1',
                                                                    'start_date': '2023-05-16 20:52',
                                                                    'end_date': '2023-05-16 21:59'})
    assert response.status_code == 404
    assert response.json['error'] == 'Table not found'


def test_remove_task(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/task/81/unschedule', headers=headers, json={})
    assert response.status_code == 201
    assert response.json['message'] == 'Task unscheduled successfully'


def test_remove_task_incorrect(client):
    headers = {'Authorization': f'Bearer {get_auth_token(client)}'}
    response = client.post('/api/task/0/unschedule', headers=headers, json={})
    assert response.status_code == 404
    assert response.json['error'] == 'Task not found'