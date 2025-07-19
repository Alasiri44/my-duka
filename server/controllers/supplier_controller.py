from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.supplier import Supplier
from ..models import db

supplier_bp = Blueprint('supplier_bp', __name__)
supplier_api = Api(supplier_bp)

class Suppliers(Resource):
    def get(self):
        response = [supplier.to_dict() for supplier in Supplier.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.form
        new_supplier = Supplier(
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
        if(new_supplier):
            db.session.add(new_supplier)
            db.session.commit()
            return make_response(new_supplier.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the supplier"}, 404)
        
supplier_api.add_resource(Suppliers, '/supplier')

class Supplier_By_ID(Resource):
    def get(self, id):
        response = Supplier.query.filter(Supplier.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The supplier does not exist"}, 404)
    def patch(self, id):
        supplier = Supplier.query.filter(Supplier.id == id).first()
        if(supplier):
            for attr in request.form:
                setattr(supplier, attr, request.form.get(attr))
            db.session.add(supplier)
            db.session.commit()
            return make_response(supplier.to_dict(), 200)
        else:
                return make_response({"message": "The supplier does not exist"}, 404)
    def delete(self, id):
        response = Supplier.query.filter(Supplier.id == id).first()
        if(response):
            db.session.delete(response)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The supplier does not exist"}, 404)
supplier_api.add_resource(Supplier_By_ID, '/supplier/<id>')