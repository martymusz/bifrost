from app.models import User


def test_new_user():
    user = User.add_new_user(email='testuser@gmail.com', password='testpassword', role=1, name='Teszt')
    assert user.email == 'testuser@gmail.com'
    assert user.password != 'testpassword'
    assert user.name == 'Teszt'
    assert user.role == 1
    assert user.userid != ''
    assert user.active


def test_status_change():
    user = User.add_new_user(email='testuser@gmail.com', password='testpassword', role=1, name='Teszt')
    user.disable_account()
    assert user.active == False


def test_role_change():
    user = User.add_new_user(email='testuser@gmail.com', password='testpassword', role=1, name='Teszt')
    user.change_role(2)
    assert user.role == 2
