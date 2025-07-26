from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from ..models.store import Store
from ..models import db
from ..models.user import User
from ..models.batch import Batch
from ..models.product import Product
from ..models.stock_entries import Stock_Entry
from ..models.stock_exits import StockExit
from datetime import datetime, timedelta


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



class StoreOverview(Resource):
    def get(self, id):
        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        today = datetime.utcnow()
        start_date = today - timedelta(days=30)

        # === Users Summary ===
        users = User.query.filter_by(store_id=id).all()
        admin_count = sum(1 for u in users if u.role == "admin")
        clerk_count = sum(1 for u in users if u.role == "clerk")

        # === Stock Entries & Exits for this store (via Batch) ===
        entries = db.session.query(Stock_Entry, Batch)\
            .join(Batch, Stock_Entry.batch_id == Batch.id)\
            .filter(Batch.store_id == id).all()

        exits = db.session.query(StockExit, Batch)\
            .join(Batch, StockExit.batch_id == Batch.id)\
            .filter(Batch.store_id == id).all()

        # === Aggregators ===
        entry_totals = {}
        exit_totals = {}
        stock_in_by_day = {}
        weekly_spend = {}
        unpaid_deliveries = 0
        product_ids = set()

        for entry, batch in entries:
            product_ids.add(entry.product_id)
            entry_totals[entry.product_id] = entry_totals.get(entry.product_id, 0) + entry.quantity_received

            # Grouped by date
            date_str = entry.created_at.date().isoformat()
            stock_in_by_day[date_str] = stock_in_by_day.get(date_str, 0) + entry.quantity_received

            # Weekly spend
            week_key = entry.created_at.strftime("Week %W %Y")
            paid = 0 if entry.payment_status == "unpaid" else float(entry.buying_price) * entry.quantity_received
            unpaid = 0 if entry.payment_status == "paid" else float(entry.buying_price) * entry.quantity_received

            weekly_spend.setdefault(week_key, {"paid": 0, "unpaid": 0})
            weekly_spend[week_key]["paid"] += paid
            weekly_spend[week_key]["unpaid"] += unpaid

            if entry.payment_status == "unpaid":
                unpaid_deliveries += 1

        for exit, batch in exits:
            product_ids.add(exit.product_id)
            exit_totals[exit.product_id] = exit_totals.get(exit.product_id, 0) + exit.quantity

        # === Net Quantities (only include products that were stocked in)
        net_quantities = {}
        for pid in entry_totals:
            net = entry_totals.get(pid, 0) - exit_totals.get(pid, 0)
            net_quantities[pid] = max(net, 0)

        # === Fetch product names
        products = Product.query.filter(Product.id.in_(net_quantities.keys())).all()
        product_name_map = {p.id: p.name for p in products}

        # === Top Products (by total stock in)
        top_products = sorted(entry_totals.items(), key=lambda x: x[1], reverse=True)
        top_products_data = [
            {"name": product_name_map.get(pid, "Unknown"), "quantity": qty}
            for pid, qty in top_products if pid in product_name_map
        ][:5]

        # === Restock Priority (lowest net quantity)
        restock_priority_data = sorted(
            [{"name": product_name_map.get(pid, "Unknown"), "quantity": qty}
             for pid, qty in net_quantities.items()],
            key=lambda x: x["quantity"]
        )[:5]

        # === Stock Breakdown by Date and Product
        stock_breakdown = {}
        for entry, batch in entries:
            if entry.product_id not in net_quantities:
                continue  # skip irrelevant products

            date = entry.created_at.date().isoformat()
            pname = product_name_map.get(entry.product_id, "Unknown")
            stock_breakdown.setdefault(date, {}).setdefault(pname, 0)
            stock_breakdown[date][pname] += entry.quantity_received

        # === Final Response ===
        return make_response({
            "store": {
                "id": store.id,
                "name": store.name,
                "location": store.location,
                "created_at": store.created_at.strftime("%Y-%m-%d")
            },
            "summary": {
                "total_products": len(net_quantities),
                "admin_count": admin_count,
                "clerk_count": clerk_count,
                "unpaid_deliveries": unpaid_deliveries
            },
            "charts": {
                "stock_in_by_day": [{"date": k, "quantity": v} for k, v in sorted(stock_in_by_day.items())],
                "weekly_spend": [{"week": k, "paid": v["paid"], "unpaid": v["unpaid"]} for k, v in weekly_spend.items()],
                "top_products": top_products_data,
                "restock_priority": restock_priority_data,
                "stock_breakdown_by_date": stock_breakdown
            }
        }, 200)

store_api.add_resource(StoreOverview, '/store/<int:id>/overview')
