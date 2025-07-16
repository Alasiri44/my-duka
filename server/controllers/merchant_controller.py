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
            first_name = request.get_json('first_name'),
            last_name = request.get_json('last_name'),
            email = request.get_json('email'),
            password_hash = request.get_json('password')
        )
        db.session.add(new_merchant)
        db.session.commit()
        return make_response(new_merchant, 200)
api.add_resource(Merchants, '/merchant')

class Merchant_By_ID(Resource):
    def get(self, id):
        response_dict = Merchant.query.filter(Merchant.id == id).first().to_dict()
        return make_response(response_dict, 200)
    def delete(self):
        merchant = Merchant.query.first()
        db.session.delete(merchant)
        db.session.commit()
        return make_response('', 204)
    def patch():
        pass
api.add_resource(Merchant_By_ID, '/merchant/<id>')