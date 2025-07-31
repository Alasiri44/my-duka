from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.business import Business
from models import db


from sqlalchemy import func
from datetime import datetime
from models.store import Store
from models.user import User
from models.product import Product
from models.supplier import Supplier
from models.stock_entries import Stock_Entry
from models.stock_exits import StockExit
from models.business_setting import Business_Setting
from models.batch import Batch
from models.category import Category


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
            county = data.get('county'),
            location = data.get('location')
        )
        if(new_business):
            db.session.add(new_business)
            db.session.commit()
            return make_response(new_business.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the business"}, 404)
        
business_api.add_resource(Businesses, '/backend/business')


class Business_By_ID(Resource):
    def get(self, id):
        business = Business.query.get(id)
        if not business:
            return make_response({"message": "The business does not exist"}, 404)

        
        business_data = business.to_dict()

        stores = Store.query.filter_by(business_id=id).all()
        business_data["stores"] = [
            {
                "id": store.id,
                "name": store.name,
                "location": store.location,
                "created_at": store.created_at.isoformat()
            }
            for store in stores
        ]

        return make_response(business_data, 200)

business_api.add_resource(Business_By_ID, '/backend/business/<int:id>')


class BusinessCategories(Resource):
    def get(self, id):
        categories = Category.query.filter_by(business_id=id).all()
        response = [
            {
                "id": category.id,
                "name": category.name,
                "description": category.description
            }
            for category in categories
        ]
        return make_response(response, 200)

business_api.add_resource(BusinessCategories, '/backend/business/<int:id>/categories')


class Business_Summary(Resource):
    def get(self, id):
        business = Business.query.get(id)
        if not business:
            return make_response({"message": "Business not found"}, 404)
        
        
        stores = Store.query.filter_by(business_id=id).all()
        store_ids = [store.id for store in stores]

        # === General Summary ===
        total_entries = db.session.query(Stock_Entry)\
            .join(Batch, Stock_Entry.batch_id == Batch.id)\
            .filter(Batch.store_id.in_(store_ids)).count()

        total_exits = StockExit.query.filter(StockExit.store_id.in_(store_ids)).count()

        total_stock_value = db.session.query(
            func.sum(Product.quantity * Product.selling_price)
        ).filter(Product.business_id == id).scalar() or 0

        summary = {
            "total_stores": len(stores),
            "total_users": User.query.filter(User.store_id.in_(store_ids)).count(),
            "total_products": Product.query.filter_by(business_id=id).count(),
            "total_suppliers": Supplier.query.filter_by(business_id=id).count(),
            "total_stock_entries": total_entries,
            "total_stock_exits": total_exits,
            "total_stock_value": float(total_stock_value)
        }

        # === Chart: Exits by Reason ===
        exits_reason_data = db.session.query(
            StockExit.reason,
            func.count(StockExit.id)
        ).filter(StockExit.store_id.in_(store_ids))\
         .group_by(StockExit.reason).all()

        summary["exits_by_reason"] = [
            {"name": r.capitalize(), "value": c} for r, c in exits_reason_data
        ]

        # === Chart: Entries by Month (last 6 months) ===
        entries_by_month = db.session.query(
            func.to_char(Stock_Entry.created_at, 'Mon YYYY'),
            func.count(Stock_Entry.id)
        ).join(Batch, Stock_Entry.batch_id == Batch.id)\
         .filter(
            Batch.store_id.in_(store_ids),
            Stock_Entry.created_at > datetime(datetime.now().year, datetime.now().month - 5, 1)
        ).group_by(
            func.to_char(Stock_Entry.created_at, 'Mon YYYY')
        ).order_by(
            func.min(Stock_Entry.created_at)
        ).all()

        summary["stock_entries_by_month"] = [
            {"month": month, "count": count} for month, count in entries_by_month
        ]

        # === Chart: Top Products (by stock in - stock out) ===
        top_products_query = db.session.query(
            Product.name,
            func.coalesce(func.sum(Stock_Entry.quantity_received), 0) - func.coalesce(func.sum(StockExit.quantity), 0)
        ).join(Stock_Entry, Stock_Entry.product_id == Product.id)\
         .join(Batch, Stock_Entry.batch_id == Batch.id)\
         .outerjoin(StockExit, StockExit.product_id == Product.id)\
         .filter(
            Product.business_id == id,
            Batch.store_id.in_(store_ids)
        )\
         .group_by(Product.name)\
         .order_by(
            (func.coalesce(func.sum(Stock_Entry.quantity_received), 0) - func.coalesce(func.sum(StockExit.quantity), 0)).desc()
        )\
         .limit(5)\
         .all()
        
        summary["top_products"] = [
            {"name": name, "value": float(balance)} for name, balance in top_products_query
        ]
        
        
        
        # === Chart: Low Stock Products (by stock in - stock out) ===
        low_stock_query = db.session.query(
            Product.name,
            func.coalesce(func.sum(Stock_Entry.quantity_received), 0) - func.coalesce(func.sum(StockExit.quantity), 0)
        ).join(Stock_Entry, Stock_Entry.product_id == Product.id)\
         .join(Batch, Stock_Entry.batch_id == Batch.id)\
         .outerjoin(StockExit, StockExit.product_id == Product.id)\
         .filter(
            Product.business_id == id,
            Batch.store_id.in_(store_ids)
        )\
         .group_by(Product.name)\
         .order_by(
            (func.coalesce(func.sum(Stock_Entry.quantity_received), 0) - func.coalesce(func.sum(StockExit.quantity), 0)).asc()
        )\
         .limit(5)\
         .all()
        
        summary["low_stock_products"] = [
            {"name": name, "value": float(balance)} for name, balance in low_stock_query
        ]

        # === Store-by-Store Summary ===
        stores_summary = []
        for store in stores:
            total_users = User.query.filter_by(store_id=store.id).count()

            store_entry_count = db.session.query(Stock_Entry)\
                .join(Batch, Stock_Entry.batch_id == Batch.id)\
                .filter(Batch.store_id == store.id).count()

            store_exit_count = StockExit.query.filter_by(store_id=store.id).count()

            store_stock_value = db.session.query(
                func.sum(Product.quantity * Product.selling_price)
            ).join(Stock_Entry, Stock_Entry.product_id == Product.id)\
             .join(Batch, Stock_Entry.batch_id == Batch.id)\
             .filter(Batch.store_id == store.id)\
             .scalar() or 0

            stores_summary.append({
                "store_id": store.id,
                "store_name": store.name,
                "total_users": total_users,
                "total_entries": store_entry_count,
                "total_exits": store_exit_count,
                "total_stock_value": float(store_stock_value)
            })
        

        summary["stores_summary"] = stores_summary

        return make_response({
         "business": {
             "id": business.id,
             "name": business.name,
             "industry": business.industry,
             "location": business.location,
             "created_at": business.created_at.strftime("%d %b %Y")
         },
         **summary
         }, 200)
business_api.add_resource(Business_Summary, '/backend/business/<int:id>/summary')

class BusinessSuppliers(Resource):
    def get(self, id):
        suppliers = Supplier.query.filter_by(business_id=id).all()
        response = [
            {
                "id": s.id,
                "name": s.name,
                "contact_name": s.contact_name,
                "email": s.email,
                "phone_number": s.phone_number,
                "paybill_number": s.paybill_number,
                "till_number": s.till_number,
                "country": s.country,
                "po_box": s.po_box,
                "postal_code": s.postal_code,
                "county": s.county,
                "location": s.location,
                "created_at": s.created_at.isoformat(),
            }
            for s in suppliers
        ]
        return make_response(response, 200)

business_api.add_resource(BusinessSuppliers, "/backend/business/<int:id>/suppliers")


class BusinessUsers(Resource):
    def get(self, id):
        # Get all stores under the business
        stores = Store.query.filter_by(business_id=id).all()
        store_ids = [store.id for store in stores]

        # Fetch all users whose store_id is in the business's stores
        users = User.query.filter(User.store_id.in_(store_ids)).all()

        response = [
            {
                "id": u.id,
                "store_id": u.store_id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "phone_number": u.phone_number,
                "gender": u.gender,
                "role": u.role,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat()
            }
            for u in users
        ]

        return make_response(response, 200)

business_api.add_resource(BusinessUsers, "/backend/business/<int:id>/users")



class BusinessInventory(Resource):
    def get(self, id):
        business = Business.query.get(id)
        if not business:
            return make_response({"message": "Business not found"}, 404)

        category_id = request.args.get("category_id", type=int)
        product_id = request.args.get("product_id", type=int)

        store_ids = [store.id for store in business.stores]

        # Fetch stock ins per product across all stores
        entry_rows = db.session.query(
            Stock_Entry.product_id,
            db.func.sum(Stock_Entry.quantity_received).label("stock_in")
        ).filter(Stock_Entry.store_id.in_(store_ids))         .group_by(Stock_Entry.product_id).all()

        # Fetch stock outs per product across all stores
        exit_rows = db.session.query(
            StockExit.product_id,
            db.func.sum(StockExit.quantity).label("stock_out")
        ).filter(StockExit.store_id.in_(store_ids))         .group_by(StockExit.product_id).all()

        stock_in_map = {r.product_id: r.stock_in for r in entry_rows}
        stock_out_map = {r.product_id: r.stock_out for r in exit_rows}

        # Get products scoped to business
        product_query = Product.query.filter_by(business_id=id)
        if category_id:
            product_query = product_query.filter_by(category_id=category_id)
        if product_id:
            product_query = product_query.filter_by(id=product_id)

        products = product_query.all()

        result = []
        for p in products:
            stocked_in = stock_in_map.get(p.id, 0)
            stocked_out = stock_out_map.get(p.id, 0)
            quantity = max(stocked_in - stocked_out, 0)

            result.append({
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "selling_price": float(p.selling_price),
                "unit": "pcs",  # or p.unit if field exists
                "quantity_on_hand": quantity,
                "category": {
                    "id": p.category.id if p.category else None,
                    "name": p.category.name if p.category else None,
                }
            })

        return make_response(result, 200)

business_api.add_resource(BusinessInventory, '/backend/business/<int:id>/inventory')




class BusinessSettingsResource(Resource):
    def get(self, id=None):
        setting = Business_Setting.query.first() if id is None else Business_Setting.query.get(id)
        return make_response([setting.to_dict()], 200) if setting else make_response([], 200)

    def post(self):
        data = request.get_json()
        try:
            setting = Business_Setting(**data)
            db.session.add(setting)
            db.session.commit()
            return make_response(setting.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)

    def patch(self, id=None):
        setting = Business_Setting.query.first() if id is None else Business_Setting.query.get(id)
        if not setting:
            return make_response({"error": "No business setting found"}, 404)

        data = request.get_json()
        try:
            for field in data:
                if hasattr(setting, field):
                    setattr(setting, field, data[field])
            db.session.commit()
            return make_response(setting.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)

business_api.add_resource(BusinessSettingsResource, "/backend/business_settings", "/business_settings/<int:id>")