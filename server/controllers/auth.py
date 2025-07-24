from flask import make_response, Blueprint, session
from flask_restful import Api, Resource

auth_bp = Blueprint('auth_bp', __name__)
auth_api = Api(auth_bp)

class CheckSession(Resource):
    def get(self):
        if 'email' in session:
            return {'email': session.get('email'), 'role': session.get('role')}
        else:
            return make_response({'message': 'Not logged in'}, 401)
auth_api.add_resource(CheckSession, '/check-session')