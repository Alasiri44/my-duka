from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.business import Business
from ..models import db


from sqlalchemy import func
from datetime import datetime
from ..models.store import Store
from ..models.user import User
from ..models.product import Product
from ..models.supplier import Supplier
from ..models.stock_entries import Stock_Entry
from ..models.stock_exits import StockExit
from ..models.batch import Batch


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
        
business_api.add_resource(Businesses, '/business')


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

business_api.add_resource(Business_By_ID, '/business/<int:id>')


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
business_api.add_resource(Business_Summary, '/business/<int:id>/summary')

