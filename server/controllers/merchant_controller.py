from flask import Blueprint, make_response, request, session, current_app
from flask_restful import Api, Resource
from ..models.merchant import Merchant
from ..models import db
from flask_mail import Message
from .. import mail
from threading import Thread

merchant_bp = Blueprint('merchant_bp', __name__)
api = Api(merchant_bp)

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

class Merchants(Resource):
    def get(self):
        response_dict = [merchant.to_dict() for merchant in Merchant.query.all()]
        return make_response(response_dict, 200)
    def post(self):
        from ..app import bcrypt
        data = request.get_json()
        new_merchant = Merchant(
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            gender = data.get('gender'),
            password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        )
        response = Merchant.query.filter(Merchant.email == data.get('email')).first()
        if(response):
            return make_response({"message": "The user already exists in the database"}, 404)
        if(new_merchant):
            db.session.add(new_merchant)
            db.session.commit()
            msg = Message(
                subject=f"Merchant Account Creation Successful",
                sender='austinalasiri44@gmail.com',
                recipients=[new_merchant.email],)
            msg.html = f"""Dear {new_merchant.first_name},

        <p>Your Merchant account with MyDuka has been successfully created on MyDuka. You can now log in and create your profile
        and access our services.</p>

        <a href="http://127.0.0.1:5173/login" style="
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;">
            Log In here
        </a>

        <p>If you have any questions or need assistance, contact our support team for help.</p>

        <p>Thank you for choosing MyDuka.</p>

        <p>Regards,<br>
        Austin Alasiri<br>
        MyDuka Team</p>
"""
            response = make_response(new_merchant.to_dict(), 201)
            # Starting background thread
            Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()
            
            return response
        else:
            return make_response({"message": "Failed to create a new merchant"}, 404)
api.add_resource(Merchants, '/merchant')

class Merchant_By_ID(Resource):
    def get(self, id):
        response = Merchant.query.filter(Merchant.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def delete(self, id):
        merchant = Merchant.query.filter(Merchant.id == id).first()
        if(merchant):
            db.session.delete(merchant)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def patch(self, id):
        merchant = Merchant.query.filter(Merchant.id == id).first()
        if(merchant):
            for attr in request.get_json():
                setattr(merchant, attr, request.get_json().get(attr))
            db.session.add(merchant)
            db.session.commit()
            return make_response(merchant.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_By_ID, '/merchant/<id>')

class Merchant_Login(Resource):
    def post(self):
        from ..app import bcrypt
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        user = Merchant.query.filter(Merchant.email == email).first()
        if(user):
            if(bcrypt.check_password_hash(user.password_hash, password)):
                # session.permanent = True
                session['email'] = user.email
                session['role'] = 'merchant'
                return make_response(user.to_dict(), 200)
            else:
                return make_response({"message": "Wrong password"}, 404)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_Login, '/merchant/login')