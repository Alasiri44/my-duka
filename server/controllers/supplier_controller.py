from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.supplier import Supplier
from models import db

supplier_bp = Blueprint('supplier_bp', __name__)
supplier_api = Api(supplier_bp)

class Suppliers(Resource):
    def get(self):
        suppliers = Supplier.query.all()
        return make_response([s.to_dict() for s in suppliers], 200)

    def post(self):
        data = request.get_json()
        try:
            new_supplier = Supplier(
                name=data.get('name'),
                business_id=int(data.get('business_id')),
                contact_name=data.get('contact_name'),
                email=data.get('email'),
                phone_number=data.get('phone_number'),
                paybill_number=data.get('paybill_number'),
                till_number=data.get('till_number'),
                location=data.get('location'),
                country=data.get('country'),
                county=data.get('county'),
                po_box=data.get('po_box'),
                postal_code=data.get('postal_code'),
            )
            db.session.add(new_supplier)
            db.session.commit()
            return make_response(new_supplier.to_dict(), 201)
        except Exception as e:
            return make_response({"message": "Failed to create supplier", "error": str(e)}, 400)

supplier_api.add_resource(Suppliers, '/backend/supplier')

class Supplier_By_ID(Resource):
    def get(self, id):
        supplier = Supplier.query.get(id)
        if supplier:
            return make_response(supplier.to_dict(), 200)
        return make_response({"message": "The supplier does not exist"}, 404)

    def patch(self, id):
        supplier = Supplier.query.get(id)
        if not supplier:
            return make_response({"message": "The supplier does not exist"}, 404)
        
        data = request.get_json()
        for attr, value in data.items():
            setattr(supplier, attr, value)
        
        db.session.commit()
        return make_response(supplier.to_dict(), 200)

    def delete(self, id):
        supplier = Supplier.query.get(id)
        if not supplier:
            return make_response({"message": "The supplier does not exist"}, 404)
        
        db.session.delete(supplier)
        db.session.commit()
        return make_response('', 204)

supplier_api.add_resource(Supplier_By_ID, '/backend/supplier/<int:id>')


class Suppliers_By_Business(Resource):
    def get(self, id):
        suppliers = Supplier.query.filter_by(business_id=id).all()
        return make_response([s.to_dict() for s in suppliers], 200)

supplier_api.add_resource(Suppliers_By_Business, '/backend/business/<int:id>/suppliers')
