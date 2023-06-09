from flask import jsonify, request, current_app
from app.models import db
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
from app.api.users import User
from app.api import api


@api.route('/test', methods=['GET'])
def test():
    """
       Testing endpoint.
       ---
       responses:
         200:
           description: OK
       """
    return jsonify({'message': 'Welcome to Bifrost'}), 200


@api.route('/login', methods=['POST'])
def login():
    """
       Végpont a bejelentkezésre.
       ---
       parameters:
         - name: email
         - name: password

       responses:
         200:
           description: OK
       """
    try:
        data = request.json
        email = data['email']
        password = data['password']
        user = User.login(email=email, password=password)

    except IndexError as e:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Incorrect login attempt')
        return jsonify({'message': 'Please provide user details', 'error': 'Bad Request'}), 400

    except Exception as e:
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'Incorrect login attempt')
        return jsonify({'message': 'Please provide user details', 'error': 'Bad Request'}), 400

    else:
        if not user:
            current_app.logger.info(
                'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + '%s failed to log in',
                user.email)
            return jsonify(
                {'error': 'Email or password is not correct'}), 403

        elif not user.active:
            current_app.logger.info(
                'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + '%s failed to log in',
                user.email)
            return jsonify({'error': 'User is not active anymore'}), 403

        else:
            token = jwt.encode(
                {'user': user.email, 'expiration': str(datetime.now() + timedelta(days=1))},
                current_app.config['SECRET_KEY'], algorithm='HS256')

            current_app.logger.info(
                'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + '%s logged in successfully',
                user.email)
            return jsonify({'token': token, 'user': user.to_dict()})


@api.route('/register', methods=['POST'])
def register():
    """
       Regisztrációs végpont.
       ---
       parameters:
         - name: email
         - name: password
         - name: name

       responses:
         201:
           description: OK
       """
    data = request.json
    email = data['email']
    password = data['password']
    name = data['name']

    users = User.query.all()

    try:
        if len(users) == 0:
            new_user = User.add_new_user(email=email, password=password, name=name, role=1)
        else:
            new_user = User.add_new_user(email=email, password=password, name=name, role=3)

        db.session.add(new_user)
        db.session.commit()

    except IntegrityError as e:
        db.session.rollback()
        current_app.logger.error(
            'ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User already exists')
        return jsonify({'error': 'User already exists'}), 500

    except Exception as e:
        db.session.rollback()
        current_app.logger.error('Error creating user', e)
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + str(e))
        return jsonify({'error': 'There was a problem creating user'}), 500

    else:
        current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' +
                                '%s created successfully', new_user.email)
        return jsonify({'message': 'User created successfully', 'data': new_user.to_dict()}), 201
