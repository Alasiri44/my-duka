from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.supply_request import Supply_Request
from ..models import db

supply_request_bp = Blueprint('supply_request_bp', __name__)
supply_request_api = Api(supply_request_bp)

class Supply_Requests(Resource):
    def get(self):
        response = [supply_request.to_dict() for supply_request in Supply_Request.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.form
        new_supply_request = Supply_Request(
            name = data.get('name'),
            business_id = data.get('business_id'),
            contact_name = data.get('contact_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            paybill_number = data.get('paybill_number'),
            till_number = data.get('till_number'),
            location = data.get('location'),
            country = data.get('country'),
            county = data.get('county'),
            po_box = data.get('location'),
            postal_code = data.get('postal_code'),
        )
        if(new_supply_request):
            db.session.add(new_supply_request)
            db.session.commit()
            return make_response(new_supply_request.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the supply_request"}, 404)
        
supply_request_api.add_resource(Supply_Requests, '/supply_request')

class Supply_Request_By_ID(Resource):
    def get(self, id):
        response = Supply_Request.query.filter(Supply_Request.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The supply_request does not exist"}, 404)
    def patch(self, id):
        supply_request = supply_request.query.filter(supply_request.id == id).first()
        if(supply_request):
            for attr in request.form:
                setattr(supply_request, attr, request.form.get(attr))
            db.session.add(supply_request)
            db.session.commit()
            return make_response(supply_request.to_dict(), 200)
        else:
                return make_response({"message": "The supply_request does not exist"}, 404)
    def delete(self, id):
        response = Supply_Request.query.filter(Supply_Request.id == id).first()
        if(response):
            db.session.delete(response)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The supply_request does not exist"}, 404)
supply_request_api.add_resource(Supply_Request_By_ID, '/supply_request/<id>')