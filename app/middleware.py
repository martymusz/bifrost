import jwt
from flask import request, jsonify, current_app
from functools import wraps
from datetime import datetime, timezone


def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            token = auth_header[7:]
            user = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            if datetime.strptime(user['expiration'],
                                 "%Y-%m-%d %H:%M:%S.%f").timestamp() > datetime.now().timestamp():
                return func(*args, **kwargs)
            else:
                return jsonify({'error': 'Token has expired'}), 403

        except jwt.InvalidTokenError:
            return jsonify({'message': 'Please provide valid credentials', 'error': 'Authentication required'}), 403

    return decorated_function

