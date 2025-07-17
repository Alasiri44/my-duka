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
        new_merchant = Merchant(
            first_name = request.get_json.get('first_name'),
            last_name = request.get_json.get('last_name'),
            email = request.get_json.get('email'),
            phone_number = request.get_json.get('phone_number'),
            gender = request.get_json.get('gender'),
            password_hash = request.get_json.get('password')
        )
        db.session.add(new_merchant)
        db.session.commit()
        return make_response(new_merchant, 201)
api.add_resource(Merchants, '/merchant')

class Merchant_By_ID(Resource):
    def get(self, id):
        response = Merchant.query.filter(Merchant.id == id).first()
        if(response):
            return make_response(response.to_dict, 200)
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
            for attr in request.form:
                setattr(merchant, attr, request.form.get(attr))
            db.session.add(merchant)
            db.session.commit()
            return make_response(merchant.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_By_ID, '/merchant/<id>')