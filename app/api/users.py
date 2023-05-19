from datetime import datetime
from flask import jsonify, request, current_app
from app.api import api
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
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:
        if data['action'] == 'deactivate':
            user.disable_account()
            current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User:% status changed',
                                    user.email)
            return jsonify({'message': 'User status changed successfully'}), 200

        else:
            user.enable_account()
            current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User:% status changed',
                                    user.email)
            return jsonify({'message': 'User status changed successfully'}), 200


@api.route('/user/<int:userid>/role', methods=['POST'])
@login_required
def change_role(userid):
    data = request.json
    try:
        user = User.get_by_userid(userid)

    except IndexError:
        current_app.logger.error(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User not found')
        return jsonify({'error': 'User not found'}), 404

    else:
        user.change_role(data['role'])
        current_app.logger.info(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ' - ' + 'User:% role changed',
                                user.email)
        return jsonify({'message': 'User role changed successfully'}), 200
