from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.supply_request import Supply_Request
from models import db

supply_request_bp = Blueprint('supply_request_bp', __name__)
supply_request_api = Api(supply_request_bp)

class Supply_Requests(Resource):
    def get(self):
        response = [supply_request.to_dict() for supply_request in Supply_Request.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.get_json() if request.is_json else request.form
        print('Received data:', data)
        new_supply_request = Supply_Request(
            product_id = data.get('product_id'),
            supplier_id = data.get('supplier_id'),
            requester_id = data.get('requester_id'),
            quantity = data.get('quantity'),
            status = data.get('status') or 'waiting',
        )
        if(new_supply_request):
            db.session.add(new_supply_request)
            db.session.commit()
            return make_response(new_supply_request.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the supply_request"}, 404)
        
supply_request_api.add_resource(Supply_Requests, '/backend/supply_request')

class Supply_Request_By_ID(Resource):
    def get(self, id):
        response = Supply_Request.query.filter(Supply_Request.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The supply_request does not exist"}, 404)
    def patch(self, id):
        supply_request = Supply_Request.query.filter(Supply_Request.id == id).first()
        if(supply_request):
            data= request.get_json()
            for key, value in data.items():
                setattr(supply_request, key, value)
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
supply_request_api.add_resource(Supply_Request_By_ID, '/backend/supply_request/<id>')