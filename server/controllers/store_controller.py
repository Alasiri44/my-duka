from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.store import Store
from ..models import db

store_bp = Blueprint('store_bp', __name__)
store_api = Api(store_bp)

class Stores(Resource):
    def get(self):
        response = [store.to_dict() for store in Store.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.get_json()
        new_store = Store(
            name = data.get('name'),
            country = data.get('country'),
            business_id = data.get('business_id'),
            po_box = data.get('po_box'),
            postal_code = data.get('postal_code'),
            county = data.get('county'),
            location = data.get('location')
        )
        if(new_store):
            db.session.add(new_store)
            db.session.commit()
            return make_response(new_store.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the store"}, 404)
        
store_api.add_resource(Stores, '/store')

class Store_By_ID(Resource):
    def get(self, id):
        response = Store.query.filter(Store.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The store does not exist"}, 404)
    def patch(self, id):
        store = Store.query.filter(Store.id == id).first()
        if(store):
            for attr in request.get_json:
                setattr(store, attr, request.get_json.get(attr))
            db.session.add(store)
            db.session.commit()
            return make_response(store.to_dict(), 200)
        else:
                return make_response({"message": "The store does not exist"}, 404)
    def delete(self, id):
        response = Store.query.filter(Store.id == id).first()
        if(response):
            db.session.delete(response)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The store does not exist"}, 404)
store_api.add_resource(Store_By_ID, '/store/<id>')