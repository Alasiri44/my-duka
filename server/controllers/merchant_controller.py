from flask import Blueprint, make_response, request
from flask_restful import Api, Resource
from ..models.merchant import Merchant
from ..models import db

merchant_bp = Blueprint('merchant_bp', __name__)
api = Api(merchant_bp)

class Merchants(Resource):
    def get(self):
        response_dict = [merchant.to_dict() for merchant in Merchant.query.all()]
        return make_response(response_dict, 200)
    def post(self):
        from ..app import bcrypt
        data = request.form
        new_merchant = Merchant(
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            gender = data.get('gender'),
            password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        )
        db.session.add(new_merchant)
        db.session.commit()
        return make_response(new_merchant.to_dict(), 201)
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
            for attr in request.get_json:
                setattr(merchant, attr, request.get_json.get(attr))
            db.session.add(merchant)
            db.session.commit()
            return make_response(merchant.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_By_ID, '/merchant/<id>')

class Merchant_Login(Resource):
    def post(self):
        from ..app import bcrypt
        email = request.form.get('email')
        password = request.form.get('password')
        user = Merchant.query.filter(Merchant.email == email).first()
        if(user):
            if(bcrypt.check_password_hash(user.password_hash, password)):
                return make_response(user.to_dict(), 200)
            else:
                return make_response({"message": "Wrong password"}, 404)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_Login, '/merchant/login')