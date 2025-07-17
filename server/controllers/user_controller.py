from flask import Blueprint, make_response, request
from flask_restful import Api, Resource
from ..models.user import User
from ..models import db

user_bp = Blueprint('user_bp', __name__)
api = Api(user_bp)

class Users(Resource):
    def get(self):
        response_dict = [user.to_dict() for user in User.query.all()]
        return make_response(response_dict, 200)
    def post(self):
        from ..app import bcrypt
        data = request.get_json()
        new_user = User(
            first_name = data.get('first_name'),
            store_id = data.get('store_id'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            gender = data.get('gender'),
            role = data.get('role'),
            is_active = data.get('is_active') or True,
            password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        )
        if(new_user):
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create a new user"}, 404)
api.add_resource(Users, '/user')

class User_By_ID(Resource):
    def get(self, id):
        response = User.query.filter(User.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if(user):
            db.session.delete(user)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if(user):
            for attr in request.get_json:
                setattr(user, attr, request.get_json.get(attr))
            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(User_By_ID, '/user/<id>')

class User_Login(Resource):
    def post(self):
        from ..app import bcrypt
        email = request.get_json.get('email')
        password = request.get_json.get('password')
        user = User.query.filter(User.email == email).first()
        if(user):
            if(bcrypt.check_password_hash(user.password_hash, password)):
                return make_response(user.to_dict(), 200)
            else:
                return make_response({"message": "Wrong password"}, 404)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(User_Login, '/user/login')

class Users_By_StoreID(Resource):
    def get(self, id):
        response_dict = [user.to_dict() for user in User.query.filter(User.store_id == id).all()]
        return make_response(response_dict, 200)
    def delete(self, id):
        user = [user.to_dict() for user in User.query.filter(User.store_id == id).all()]
        if(user):
            db.session.delete(user)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Users_By_StoreID, '/user/store/<id>')

class Admins(Resource):
    def get(self):
        response_dict = [user.to_dict() for user in User.query.filter(User.role == 'admin').all()]
        return make_response(response_dict, 200)
api.add_resource(Admins, '/user/admins')

class Clerks(Resource):
    def get(self):
        response_dict = [user.to_dict() for user in User.query.filter(User.role == 'clerk').all()]
        return make_response(response_dict, 200)
api.add_resource(Clerks, '/user/clerks')

class Clerks_By_StoreID(Resource):
    def get(self):
        response_dict = [user.to_dict() for user in User.query.filter(User.role == 'clerk' and User.store_id == id).all()]
        return make_response(response_dict, 200)
api.add_resource(Clerks_By_StoreID, '/user/store/clerks/<id>')