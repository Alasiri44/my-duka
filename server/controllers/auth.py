from flask import make_response, Blueprint, session
from flask_restful import Api, Resource

auth_bp = Blueprint('auth_bp', __name__)
auth_api = Api(auth_bp)

class CheckSession(Resource):
    def get(self):
        if 'email' in session:
            role = session.get("role")
            if role == "merchant":
                from models.merchant import Merchant
                user = Merchant.query.get(session["user_id"])
                if user:
                    return {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "role": role
                    }
            else:
                from models.user import User
                if "user_id" not in session:
                    return {"message": "Not logged in"}, 401
                user = User.query.get(session["user_id"])
                if user:
                    return {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "role": role,
                        "store_id": user.store_id
                    }

        return make_response({'message': 'Not logged in'}, 401)

auth_api.add_resource(CheckSession, '/check-session')



class Logout(Resource):
    def delete(self):
        session.clear()
        return {"message": "Logged out successfully"}, 200
auth_api.add_resource(Logout, '/logout')