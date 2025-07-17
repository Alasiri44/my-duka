from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.business import Business
from ..models import db

business_bp = Blueprint('business_bp', __name__)
business_api = Api(business_bp)

class Businesses(Resource):
    def get(self):
        response = [business.to_dict() for business in Business.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.get_json()
        new_business = Business(
            name = data.get('name'),
            industry = data.get('industry'),
            country = data.get('country'),
            merchant_id = data.get('merchant_id'),
            po_box = data.get('po_box'),
            postal_code = data.get('postal_code'),
            county = data.get('county')
        )
        if(new_business):
            db.session.add(new_business)
            db.session.commit()
            return make_response(new_business.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the business"}, 404)
        
business_api.add_resource(Businesses, '/business')

class Business_By_ID(Resource):
    def get(self, id):
        response = Business.query.filter(Business.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The business does not exist"}, 404)
    def patch(self, id):
        business = Business.query.filter(Business.id == id).first()
        if(business):
            for attr in request.get_json:
                setattr(business, attr, request.get_json.get(attr))
            db.session.add(business)
            db.session.commit()
            return make_response(business.to_dict(), 200)
        else:
                return make_response({"message": "The business does not exist"}, 404)
    def delete(self, id):
        response = Business.query.filter(Business.id == id).first()
        if(response):
            db.session.delete(response)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The business does not exist"}, 404)
business_api.add_resource(Business_By_ID, '/business/<id>')