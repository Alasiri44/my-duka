from flask_restful import Api, Resource
from flask import make_response, Blueprint
from ..models.business import Business
from ..models import db

business_bp = Blueprint('business_bp', __name__)
business_api = Api(business_bp)

class Businesses(Resource):
    def get(self):
        response = [business.to_dict() for business in Business.query.all()]
        return make_response(response, 200)
    def post(self):
        pass
business_api.add_resource(Businesses, '/business')

class Business_By_ID(Resource):
    def get(self, id):
        response = Business.query.filter(Business.id == id).first().to_dict()
        return make_response(response, 200)
    def patch(self, id):
        pass
    def delete(self, id):
        response = Business.query.filter(Business.id == id).first().to_dict()
        db.session.delete(response)
        db.session.commit()
        return make_response('', 204)
business_api.add_resource(Business_By_ID, '/business/<id>')