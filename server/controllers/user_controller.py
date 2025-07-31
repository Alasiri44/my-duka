from flask import Blueprint, make_response, request, session
from flask_restful import Api, Resource
from models.user import User
from models import db
from flask_mail import Message
from random import randint
from __init__ import mail

user_bp = Blueprint('user_bp', __name__)
api = Api(user_bp)

# --- CREATE & GET ALL USERS ---
class Users(Resource):
    def get(self):
        users = User.query.all()
        return make_response([u.to_dict() for u in users], 200)

    def post(self):
        from app import bcrypt
        data = request.get_json()
        password = str(randint(100000, 999999))
        new_user = User(
            first_name = data.get('first_name'),
            store_id = data.get('store_id'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            gender = data.get('gender'),
            role = data.get('role'),
            is_active = data.get('is_active') or True,
            password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()

        msg = Message(
                subject=f"{new_user.role.capitalize()} Account Creation Successful",
                sender='myduka77@gmail.com',
                recipients=[new_user.email],
                        body=f"""Dear {new_user.first_name},

        Your {new_user.role} account has been successfully created on MyDuka.

        Login details:
        - Email: {new_user.email}
        - Password: {password}  (valid for 48 hours)

        Use this OTP Password to log in and complete your setup. You will be prompted to create a new password:
        Login here: https://myduka-xylv.onrender.com/login

        If you did not request this account, please ignore this email and contact our support team immediately..

        Regards,  
        Austin Alasiri, Customer Support
        MyDuka Team
        """
            )
        mail.send(msg)
        return make_response(new_user.to_dict(), 201)

api.add_resource(Users, '/backend/user')


# --- USER BY ID ---
class User_By_ID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict(), 200)
        return make_response({"message": "The user does not exist in the database"}, 404)

    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message": "The user does not exist in the database"}, 404)
        data = request.get_json()
        for attr in data:
            setattr(user, attr, data.get(attr))
        db.session.commit()
        return make_response(user.to_dict(), 200)

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message": "The user does not exist in the database"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response('', 204)

api.add_resource(User_By_ID, '/backend/user/<int:id>')


# --- LOGIN ---
class User_Login(Resource):
    def options(self):
        return make_response('', 200)

    def post(self):
        from app import bcrypt
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            session['user_id'] = user.id 
            session['email'] = user.email
            session['role'] = user.role

            return make_response({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "store_id": user.store_id
            }, 200)

        return make_response({"message": "Invalid credentials"}, 404)
api.add_resource(User_Login, '/backend/user/login')



# --- USERS BY STORE ---
class UsersByStore(Resource):
    def get(self, store_id):
        users = User.query.filter_by(store_id=store_id).all()
        return make_response([u.to_dict() for u in users], 200)

    def delete(self, store_id):
        users = User.query.filter_by(store_id=store_id).all()
        if not users:
            return make_response({"message": "No users found for this store."}, 404)
        for u in users:
            db.session.delete(u)
        db.session.commit()
        return make_response('', 204)

api.add_resource(UsersByStore, '/backend/stores/<int:store_id>/users')


# --- ADMINS ---
class Admins(Resource):
    def get(self):
        admins = User.query.filter_by(role='admin').all()
        return make_response([u.to_dict() for u in admins], 200)

api.add_resource(Admins, '/backend/user/admins')


# --- CLERKS ---
class Clerks(Resource):
    def get(self):
        clerks = User.query.filter_by(role='clerk').all()
        # Add a 'name' field to each clerk
        clerk_dicts = []
        for u in clerks:
            d = u.to_dict()
            d['name'] = f"{d.get('first_name', '')} {d.get('last_name', '')}".strip()
            clerk_dicts.append(d)
        return make_response(clerk_dicts, 200)

api.add_resource(Clerks, '/backend/user/clerks')


# --- USER STATS ---
class UserStats(Resource):
    def get(self, user_id):
        from models.stock_entries import Stock_Entry
        from models.stock_exits import StockExit
        from models.supply_request import Supply_Request

        entry_count = Stock_Entry.query.filter_by(clerk_id=user_id).count()
        exit_count = StockExit.query.filter_by(recorded_by=user_id).count()
        requests = Supply_Request.query.filter_by(requester_id=user_id).all()
        approved_count = sum(1 for r in requests if r.status == "approved")

        user = User.query.get(user_id)
        supervised = 0
        if user and user.role == "admin":
            supervised = User.query.filter_by(store_id=user.store_id, role="clerk").count()

        return make_response({
            "entries": entry_count,
            "exits": exit_count,
            "requests": len(requests),
            "approved": approved_count,
            "supervised": supervised
        }, 200)

api.add_resource(UserStats, '/backend/users/<int:user_id>/stats')
