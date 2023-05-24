from datetime import datetime
from flask import jsonify, request, current_app
from app.api import api
from app.models import db
from app.middleware import login_required
from app.models.user import User


@api.route('/users')
@login_required
def get_all_users():
    result = User.query.all()
    users = sorted(result, key=lambda x: x.userid)
    return jsonify([user.to_dict() for user in users]), 200


@api.route('/user/<int:userid>/status', methods=['POST'])
@login_required
def change_status(userid):
    data = request.json
    try:
        user = User.get_by_userid(userid)

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:
        if data['action'] == 'deactivate':
            user.disable_account()
            db.session.commit()
            current_app.logger.info(
                'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User:% status changed',
                user.email)
            return jsonify({'message': 'User status changed successfully'}), 200

        else:
            user.enable_account()
            db.session.commit()
            current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - '
                                    + 'User status changed: ' + user.email)
            return jsonify({'message': 'User status changed successfully'}), 200


@api.route('/user/<int:userid>/role', methods=['POST'])
@login_required
def change_role(userid):
    data = request.json
    try:
        role = data['role']
        user = User.get_by_userid(userid)

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:
        user.change_role(role)
        db.session.commit()
        current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User role changed: ' +
                                user.email)
        return jsonify({'message': 'User role changed successfully'}), 200


@api.route('/user/<int:userid>/name', methods=['POST'])
@login_required
def change_name(userid):
    data = request.json
    try:
        name = data["name"]
        user = User.get_by_userid(userid)

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:
        user.change_name(name)
        db.session.commit()
        current_app.logger.info('INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User name changed: ' +
                                user.email)
        return jsonify({'message': 'User name changed successfully'}), 200


@api.route('/user/<int:userid>/password', methods=['POST'])
@login_required
def change_password(userid):
    data = request.json
    try:
        password = data["password"]
        user = User.get_by_userid(userid)

    except IndexError:
        current_app.logger.error('ERROR:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:

        user.change_password(password)
        db.session.commit()
        current_app.logger.info(
            'INFO:' + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User password changed: ' +
            user.email)
        return jsonify({'message': 'User password changed successfully'}), 200
