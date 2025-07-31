from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.store import Store
from models import db
from models.user import User
from models.batch import Batch
from models.product import Product
from models.stock_entries import Stock_Entry
from models.stock_exits import StockExit
from datetime import datetime, timedelta
from models.stock_exits import StockExit
from models.sale import Sale
from sqlalchemy.orm import joinedload


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



from flask import request, make_response
from flask_restful import Resource
from datetime import datetime, timedelta
from models.store import Store
from models.user import User
from models.product import Product
from models.stock_entries import Stock_Entry
from models.stock_exits import StockExit

class StoreOverview(Resource):
    def get(self, id):
        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        today = datetime.utcnow().date()
        start_30_days_ago = today - timedelta(days=30)

        # === Users Summary ===
        users = User.query.filter_by(store_id=id).all()
        admin_count = sum(1 for u in users if u.role == "admin")
        clerk_count = sum(1 for u in users if u.role == "clerk")

        # === Stock Entries & Exits for this store ===
        entries = Stock_Entry.query.filter_by(store_id=id).all()
        exits = StockExit.query.filter_by(store_id=id).all()

        # === Sales for this store ===
        sales = Sale.query.filter_by(store_id=id).all()
        total_sales = sum(float(s.total_amount) for s in sales)

        # === Daily Sales for Last 30 Days ===
        daily_sales = {}
        for s in sales:
            sale_date = s.created_at.date()
            if start_30_days_ago <= sale_date <= today:
                key = sale_date.isoformat()
                daily_sales[key] = daily_sales.get(key, 0) + float(s.total_amount)

        for i in range(31):
            date = (start_30_days_ago + timedelta(days=i)).isoformat()
            daily_sales.setdefault(date, 0)

        # === Sales by Payment Method (Pie Chart) ===
        payment_method_summary = {}
        for sale in sales:
            method = sale.payment_method or "Unknown"
            payment_method_summary[method] = payment_method_summary.get(method, 0) + float(sale.total_amount)

        # === Inventory Aggregates ===
        entry_totals = {}
        exit_totals = {}
        weekly_spend = {}
        unpaid_deliveries = 0

        for entry in entries:
            pid = entry.product_id
            entry_totals[pid] = entry_totals.get(pid, 0) + entry.quantity_received

            # Weekly spend
            week_key = entry.created_at.strftime("Week %W %Y")
            paid = 0 if entry.payment_status == "unpaid" else float(entry.buying_price) * entry.quantity_received
            unpaid = 0 if entry.payment_status == "paid" else float(entry.buying_price) * entry.quantity_received

            weekly_spend.setdefault(week_key, {"paid": 0, "unpaid": 0})
            weekly_spend[week_key]["paid"] += paid
            weekly_spend[week_key]["unpaid"] += unpaid

            if entry.payment_status == "unpaid":
                unpaid_deliveries += 1

        for exit in exits:
            pid = exit.product_id
            exit_totals[pid] = exit_totals.get(pid, 0) + exit.quantity

        # === Fetch all business-level products ===
        products = Product.query.filter_by(business_id=store.business_id).all()
        product_name_map = {p.id: p.name for p in products}
        all_product_ids = {p.id for p in products}

        # === Net Quantities
        net_quantities = {}
        for pid in all_product_ids:
            net = entry_totals.get(pid, 0) - exit_totals.get(pid, 0)
            net_quantities[pid] = max(net, 0)

        # === Top Products by Stock In
        top_products = sorted(entry_totals.items(), key=lambda x: x[1], reverse=True)
        top_products_data = [
            {
                "name": product_name_map.get(pid, "Unknown"),
                "quantity": qty,
                "quantity_on_hand": net_quantities.get(pid, 0)
            }
            for pid, qty in top_products if pid in product_name_map
        ][:5]

        # === Restock Priority
        restock_priority_data = sorted(
            [
                {
                    "name": product_name_map.get(pid, "Unknown"),
                    "quantity": net_qty,
                    "never_stocked": pid not in entry_totals
                }
                for pid, net_qty in net_quantities.items()
            ],
            key=lambda x: x["quantity"]
        )[:5]

        # === Stock Breakdown by Date and Product
        stock_breakdown = {}
        for entry in entries:
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
                "total_products": len(products),
                "admin_count": admin_count,
                "clerk_count": clerk_count,
                "unpaid_deliveries": unpaid_deliveries,
                "total_sales": total_sales
            },
            "charts": {
                "daily_sales_last_30_days": [
                    {"date": d, "amount": daily_sales[d]} for d in sorted(daily_sales.keys())
                ],
                "weekly_spend": [
                    {"week": k, "paid": v["paid"], "unpaid": v["unpaid"]} for k, v in weekly_spend.items()
                ],
                "sales_by_payment_method": [
                    {"method": k, "amount": v} for k, v in payment_method_summary.items()
                ],
                "top_products": top_products_data,
                "restock_priority": restock_priority_data,
                "stock_breakdown_by_date": stock_breakdown
            }
        }, 200)
store_api.add_resource(StoreOverview, '/store/<int:id>/overview')




class StoreStockEntries(Resource):
    def get(self, id):
        from models.supplier import Supplier
        from models.product import Product

        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        product_id = request.args.get("product_id", type=int)
        supplier_id = request.args.get("supplier_id", type=int)
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        query = db.session.query(Stock_Entry)\
            .options(
                joinedload(Stock_Entry.supplier),
                joinedload(Stock_Entry.product)
            )\
            .filter(Stock_Entry.store_id == id)

        if product_id:
            query = query.filter(Stock_Entry.product_id == product_id)
        if supplier_id:
            query = query.filter(Stock_Entry.supplier_id == supplier_id)
        if start_date:
            query = query.filter(Stock_Entry.created_at >= start_date)
        if end_date:
            query = query.filter(Stock_Entry.created_at <= end_date)

        entries = query.order_by(Stock_Entry.created_at.desc()).all()

        response = []
        for e in entries:
            response.append({
                "id": e.id,
                "product_id": e.product_id,
                "product_name": e.product.name if e.product else None,
                "supplier_id": e.supplier_id,
                "supplier": {
                    "id": e.supplier.id,
                    "name": e.supplier.name,
                    "paybill_number": e.supplier.paybill_number,
                    "till_number": e.supplier.till_number,
                    "phone_number": e.supplier.phone_number,
                } if e.supplier else None,
                "clerk_id": e.clerk_id,
                "batch_id": e.batch_id,
                "store_id": e.store_id,
                "quantity_received": e.quantity_received,
                "buying_price": float(e.buying_price),
                "payment_status": e.payment_status,
                "created_at": e.created_at.isoformat(),
            })

        return make_response(response, 200)

store_api.add_resource(StoreStockEntries, "/store/<int:id>/stock_entries")


class StoreProducts(Resource):
    def get(self, id):
        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        products = Product.query.filter_by(business_id=store.business_id).all()

        response = [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "category_id": p.category_id,
                "selling_price": float(p.selling_price),
            }
            for p in products
        ]
        return make_response(response, 200)

store_api.add_resource(StoreProducts, "/store/<int:id>/products")

class StoreUsers(Resource):
    def get(self, id):
        users = User.query.filter_by(store_id=id).all()
        response = [
            {
                "id": u.id,
                "store_id": u.store_id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "role": u.role,
            }
            for u in users
        ]
        return make_response(response, 200)

store_api.add_resource(StoreUsers, "/store/<int:id>/users")

class StoreBatches(Resource):
    def get(self, id):
        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        direction = request.args.get("direction")  # 'in' or 'out'

        query = Batch.query.filter_by(store_id=id)
        if direction:
            query = query.filter_by(direction=direction)

        batches = query.order_by(Batch.created_at.desc()).all()

        response = [
            {
                "id": b.id,
                "store_id": b.store_id,
                "direction": b.direction,
                "created_at": b.created_at.isoformat(),
            }
            for b in batches
        ]

        return make_response(response, 200)

store_api.add_resource(StoreBatches, "/store/<int:id>/batches")





class StoreInventory(Resource):
    def get(self, id):
        store = Store.query.get(id)
        if not store:
            return make_response({"message": "Store not found"}, 404)

        products = Product.query.filter_by(business_id=store.business_id).all()
        product_ids = [p.id for p in products]

        entries = Stock_Entry.query.filter(
            Stock_Entry.store_id == id,
            Stock_Entry.product_id.in_(product_ids)
        ).all()

        exits = StockExit.query.filter(
            StockExit.store_id == id,
            StockExit.product_id.in_(product_ids)
        ).all()

        entry_totals = {}
        for e in entries:
            entry_totals[e.product_id] = entry_totals.get(e.product_id, 0) + e.quantity_received

        exit_totals = {}
        for e in exits:
            exit_totals[e.product_id] = exit_totals.get(e.product_id, 0) + e.quantity

        from models.category import Category
        categories = Category.query.filter_by(business_id=store.business_id).all()
        category_map = {c.id: c.name for c in categories}

        response = []
        for p in products:
            pid = p.id
            qty = entry_totals.get(pid, 0) - exit_totals.get(pid, 0)
            response.append({
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "category_id": p.category_id,
                "category_name": category_map.get(p.category_id, "Uncategorized"),
                "selling_price": float(p.selling_price),
                "quantity_on_hand": max(qty, 0)
            })

        return make_response(response, 200)

store_api.add_resource(StoreInventory, "/store/<int:id>/inventory")





