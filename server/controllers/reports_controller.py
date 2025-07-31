from flask import Blueprint, request, jsonify, make_response
from sqlalchemy import func
from datetime import datetime

from models.sale import Sale
from models.stock_exits import StockExit
from models.stock_entries import Stock_Entry
from models.product import Product
from models.user import User
from models.store import Store
from models.category import Category
from models.supplier import Supplier
from models.supply_request import Supply_Request
from __init__ import db

reports_bp = Blueprint('reports', __name__)

def get_date_range():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if start_date:
        start_date = datetime.fromisoformat(start_date)
    if end_date:
        end_date = datetime.fromisoformat(end_date)
    return start_date, end_date

# 1. Sales Summary
@reports_bp.route("/backend/business/<int:business_id>/reports/sales-summary")
def sales_summary(business_id):
    start_date, end_date = get_date_range()
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        func.date(Sale.created_at).label("date"),
        func.sum(Sale.total_amount).label("total_sales")
    ).join(Store).filter(Store.business_id == business_id)

    if store_id:
        query = query.filter(Sale.store_id == store_id)
    if start_date:
        query = query.filter(Sale.created_at >= start_date)
    if end_date:
        query = query.filter(Sale.created_at <= end_date)

    data = query.group_by(func.date(Sale.created_at)).order_by(func.date(Sale.created_at)).all()
    return jsonify([{"date": str(r.date), "total_sales": float(r.total_sales)} for r in data])

# 2. Top Products
@reports_bp.route("/backend/business/<int:business_id>/reports/top-products")
def top_products(business_id):
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        Product.name,
        func.sum(StockExit.quantity).label("total_sold")
    ).join(StockExit).join(Store).filter(Product.business_id == business_id, StockExit.reason == 'sold')

    if store_id:
        query = query.filter(StockExit.store_id == store_id)

    query = query.group_by(Product.name).order_by(func.sum(StockExit.quantity).desc()).limit(10)
    return jsonify([{"product": p.name, "total_sold": int(p.total_sold)} for p in query.all()])

# 3. Sales by Payment Method
@reports_bp.route("/backend/business/<int:business_id>/reports/sales-by-payment-method")
def sales_by_payment_method(business_id):
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        Sale.payment_method,
        func.sum(Sale.total_amount).label("total")
    ).join(Store).filter(Store.business_id == business_id)

    if store_id:
        query = query.filter(Sale.store_id == store_id)

    query = query.group_by(Sale.payment_method)
    return jsonify([{"payment_method": r.payment_method, "total": float(r.total)} for r in query.all()])

# 4. Sales by Clerk
@reports_bp.route("/backend/business/<int:business_id>/reports/sales-by-clerk")
def sales_by_clerk(business_id):
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        User.first_name,
        func.sum(Sale.total_amount).label("total_sales")
    ).join(Sale).join(Store).filter(Store.business_id == business_id)

    if store_id:
        query = query.filter(Sale.store_id == store_id)

    query = query.group_by(User.first_name)
    return jsonify([{"clerk": r.first_name, "total_sales": float(r.total_sales)} for r in query.all()])

# 5. Stock Entries
@reports_bp.route("/backend/business/<int:business_id>/reports/stock-entries")
def stock_entries_summary(business_id):
    store_id = request.args.get("store_id", type=int)
    start_date, end_date = get_date_range()

    query = db.session.query(
        Product.name,
        func.sum(Stock_Entry.quantity_received).label("total_received")
    ).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)
    if start_date:
        query = query.filter(Stock_Entry.created_at >= start_date)
    if end_date:
        query = query.filter(Stock_Entry.created_at <= end_date)

    query = query.group_by(Product.name).order_by(func.sum(Stock_Entry.quantity_received).desc())
    return jsonify([{"product": r.name, "total_received": int(r.total_received)} for r in query.all()])

# 6. Stock Exits
@reports_bp.route("/backend/business/<int:business_id>/reports/stock-exits")
def stock_exits_summary(business_id):
    store_id = request.args.get("store_id", type=int)
    start_date, end_date = get_date_range()

    query = db.session.query(
        StockExit.reason,
        func.sum(StockExit.quantity).label("total")
    ).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        query = query.filter(StockExit.store_id == store_id)
    if start_date:
        query = query.filter(StockExit.created_at >= start_date)
    if end_date:
        query = query.filter(StockExit.created_at <= end_date)

    query = query.group_by(StockExit.reason)
    return jsonify([{"reason": r.reason, "total": int(r.total)} for r in query.all()])

# 7. Product Performance
@reports_bp.route("/backend/business/<int:business_id>/reports/product-performance")
def product_performance(business_id):
    store_id = request.args.get("store_id", type=int)

    entries = db.session.query(
        Product.id.label("product_id"),
        Product.name.label("product_name"),
        func.sum(Stock_Entry.quantity_received).label("stock_in")
    ).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        entries = entries.filter(Stock_Entry.store_id == store_id)

    entries = entries.group_by(Product.id, Product.name).subquery()

    exits = db.session.query(
        StockExit.product_id,
        func.sum(StockExit.quantity).label("stock_out")
    ).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        exits = exits.filter(StockExit.store_id == store_id)

    exits = exits.group_by(StockExit.product_id).subquery()

    query = db.session.query(
        entries.c.product_name,
        entries.c.stock_in,
        func.coalesce(exits.c.stock_out, 0).label("stock_out"),
        (entries.c.stock_in - func.coalesce(exits.c.stock_out, 0)).label("balance")
    ).outerjoin(exits, entries.c.product_id == exits.c.product_id)

    result = query.all()
    return jsonify([
        {
            "product": r.product_name,
            "stock_in": int(r.stock_in),
            "stock_out": int(r.stock_out),
            "balance": int(r.balance)
        } for r in result
    ])

# 8. Payment Status Summary
@reports_bp.route("/backend/business/<int:business_id>/reports/payment-status")
def payment_status_summary(business_id):
    store_id = request.args.get("store_id", type=int)
    query = db.session.query(
        Stock_Entry.payment_status,
        func.sum(Stock_Entry.quantity_received * Stock_Entry.buying_price).label("total")
    ).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)

    query = query.group_by(Stock_Entry.payment_status)
    return jsonify([{"payment_status": r.payment_status, "total": float(r.total)} for r in query.all()])

# 9. Procurement Spend per Supplier
@reports_bp.route("/backend/business/<int:business_id>/reports/procurement-spend")
def procurement_spend(business_id):
    store_id = request.args.get("store_id", type=int)
    product_id = request.args.get("product_id", type=int)

    query = db.session.query(
        Supplier.name,
        func.sum(Stock_Entry.quantity_received * Stock_Entry.buying_price).label("total_spent")
    ).join(Supplier).join(Product).join(Store).filter(Product.business_id == business_id)

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)
    if product_id:
        query = query.filter(Stock_Entry.product_id == product_id)

    query = query.group_by(Supplier.name).order_by(func.sum(Stock_Entry.quantity_received * Stock_Entry.buying_price).desc())
    return jsonify([{"supplier": r.name, "total_spent": float(r.total_spent)} for r in query.all()])

# 10. Unpaid Stock Entries
@reports_bp.route("/backend/business/<int:business_id>/reports/unpaid-entries")
def unpaid_stock_entries(business_id):
    store_id = request.args.get("store_id", type=int)
    query = db.session.query(
        Stock_Entry.id,
        Product.name.label("product"),
        Stock_Entry.quantity_received,
        Stock_Entry.buying_price,
        Supplier.name.label("supplier"),
        Stock_Entry.created_at
    ).join(Product).join(Supplier).join(Store).filter(
        Product.business_id == business_id,
        Stock_Entry.payment_status == 'unpaid'
    )

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)

    entries = query.order_by(Stock_Entry.created_at.desc()).all()
    return jsonify([
        {
            "entry_id": r.id,
            "product": r.product,
            "quantity": int(r.quantity_received),
            "buying_price": float(r.buying_price),
            "supplier": r.supplier,
            "date": r.created_at.strftime("%Y-%m-%d")
        } for r in entries
    ])

# 11. Supplier Payments History
@reports_bp.route("/backend/business/<int:business_id>/reports/supplier-payments")
def supplier_payments(business_id):
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        Supplier.name.label("supplier"),
        func.sum(Stock_Entry.quantity_received * Stock_Entry.buying_price).label("amount"),
        func.max(Stock_Entry.created_at).label("last_payment_date")
    ).join(Supplier).join(Product).join(Store).filter(
        Product.business_id == business_id,
        Stock_Entry.payment_status == "paid"
    )

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)

    query = query.group_by(Supplier.name).order_by(func.max(Stock_Entry.created_at).desc())
    results = query.all()

    return jsonify([
        {
            "supplier": r.supplier,
            "amount": float(r.amount),
            "last_payment_date": r.last_payment_date.strftime("%Y-%m-%d %H:%M:%S")
        } for r in results
    ])
    

# 12. Top Suppliers by Volume
@reports_bp.route("/backend/business/<int:business_id>/reports/top-suppliers-by-volume")
def top_suppliers(business_id):
    store_id = request.args.get("store_id", type=int)

    query = db.session.query(
        Supplier.name,
        func.sum(Stock_Entry.quantity_received).label("total_supplied")
    ).join(Supplier).join(Product).join(Store).filter(
        Product.business_id == business_id
    )

    if store_id:
        query = query.filter(Stock_Entry.store_id == store_id)

    query = query.group_by(Supplier.name).order_by(func.sum(Stock_Entry.quantity_received).desc()).limit(10)

    return jsonify([
        {
            "supplier": r.name,
            "total_supplied": int(r.total_supplied)
        } for r in query.all()
    ])
    
    
# 13. Store Performance Summary
@reports_bp.route("/backend/business/<int:business_id>/reports/store-performance")
def store_performance(business_id):
    query = (
        db.session.query(
            Store.id.label("store_id"),
            Store.name.label("store_name"),
            func.count(Stock_Entry.id).label("total_entries"),
            func.count(StockExit.id).label("total_exits"),
            func.coalesce(func.sum(Sale.total_amount), 0).label("total_sales")
        )
        .outerjoin(Stock_Entry, Store.id == Stock_Entry.store_id)
        .outerjoin(StockExit, Store.id == StockExit.store_id)
        .outerjoin(Sale, Store.id == Sale.store_id)
        .filter(Store.business_id == business_id)
        .group_by(Store.id, Store.name)
    )

    results = query.all()

    return jsonify([
        {
            "store_id": r.store_id,
            "store_name": r.store_name,
            "total_entries": int(r.total_entries),
            "total_exits": int(r.total_exits),
            "total_sales": float(r.total_sales)
        } for r in results
    ])
    
    
# 14. User Activity Summary
@reports_bp.route("/backend/business/<int:business_id>/reports/user-activity")
def user_activity(business_id):
    store_id = request.args.get("store_id", type=int)

    # Stock entries (by clerk)
    stock_entries = db.session.query(
        User.id.label("user_id"),
        func.count(Stock_Entry.id).label("entries_made")
    ).join(Stock_Entry, Stock_Entry.clerk_id == User.id)\
     .join(Store, User.store_id == Store.id)\
     .filter(Store.business_id == business_id)

    if store_id:
        stock_entries = stock_entries.filter(User.store_id == store_id)

    stock_entries = stock_entries.group_by(User.id).subquery()

    # Stock exits (by recorded_by)
    stock_exits = db.session.query(
        User.id.label("user_id"),
        func.count(StockExit.id).label("exits_made")
    ).join(StockExit, StockExit.recorded_by == User.id)\
     .join(Store, User.store_id == Store.id)\
     .filter(Store.business_id == business_id)

    if store_id:
        stock_exits = stock_exits.filter(User.store_id == store_id)

    stock_exits = stock_exits.group_by(User.id).subquery()

    # Supply requests (by requester_id)
    supply_requests = db.session.query(
        User.id.label("user_id"),
        func.count().label("requests_made")
    ).join(Supply_Request, Supply_Request.requester_id == User.id)\
     .join(Store, User.store_id == Store.id)\
     .filter(Store.business_id == business_id)

    if store_id:
        supply_requests = supply_requests.filter(User.store_id == store_id)

    supply_requests = supply_requests.group_by(User.id).subquery()

    # Combined summary
    combined = db.session.query(
        User.first_name,
        User.last_name,
        User.email,
        User.role,
        User.created_at,
        func.coalesce(stock_entries.c.entries_made, 0).label("entries_made"),
        func.coalesce(stock_exits.c.exits_made, 0).label("exits_made"),
        func.coalesce(supply_requests.c.requests_made, 0).label("requests_made")
    ).outerjoin(stock_entries, User.id == stock_entries.c.user_id)\
     .outerjoin(stock_exits, User.id == stock_exits.c.user_id)\
     .outerjoin(supply_requests, User.id == supply_requests.c.user_id)\
     .join(Store, User.store_id == Store.id)\
     .filter(Store.business_id == business_id)

    results = [
        {
            "user": f"{row.first_name} {row.last_name}",
            "email": row.email,
            "role": row.role,
            "created_at": row.created_at.strftime("%Y-%m-%d"),
            "entries_made": int(row.entries_made),
            "exits_made": int(row.exits_made),
            "requests_made": int(row.requests_made)
        }
        for row in combined.all()
    ]

    return jsonify(results)
