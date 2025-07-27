from flask import Blueprint, request, jsonify, make_response
from ..models.stock_entries import Stock_Entry
from ..models.batch import Batch
from ..models.product import Product
from ..models import db

stock_entry_bp = Blueprint('stock_entry_bp', __name__)

@stock_entry_bp.route('/stock_entries', methods=['GET'])
def get_stock_entries():
    store_id = request.args.get('store_id')
    product_id = request.args.get('product_id')
    if not store_id and not product_id:
        return make_response({'error': 'store_id or product_id is required'}, 400)
    query = db.session.query(Stock_Entry).join(Batch)
    if store_id:
        query = query.filter(Batch.store_id == store_id)
    if product_id:
        query = query.filter(Stock_Entry.product_id == product_id)
    entries = query.all()
    result = []
    for entry in entries:
        product = Product.query.get(entry.product_id)
        entry_dict = entry.to_dict()
        entry_dict['product_name'] = product.name if product else None
        entry_dict['stock_quantity'] = product.quantity if product else None
        result.append(entry_dict)
    return jsonify(result)

@stock_entry_bp.route('/stock_entries', methods=['POST'])
def create_stock_entry():
    data = request.get_json()
    batch_id = data.get('batch_id')
    store_id = data.get('store_id')
    clerk_id = data.get('clerk_id')
    product_id = data.get('product_id')
    supplier_id = data.get('supplier_id')
    quantity_received = data.get('quantity_received')
    spoilt = data.get('spoilt', 0)
    buying_price = data.get('buying_price')
    payment_status = data.get('payment_status')
    payment_method = data.get('payment_method')
    created_at = data.get('created_at')

    # Ensure batch exists or create it
    batch = Batch.query.get(batch_id)
    if not batch:
        batch = Batch(
            id=batch_id,
            store_id=store_id,
            direction="in",
            party="supplier",
            created_by=clerk_id,
            created_at=created_at
        )
        db.session.add(batch)
        db.session.commit()

    # Create stock entry
    stock_entry = Stock_Entry(
        product_id=product_id,
        clerk_id=clerk_id,
        batch_id=batch.id,
        supplier_id=supplier_id,
        quantity_received=quantity_received,
        spoilt=spoilt,
        buying_price=buying_price,
        payment_status=payment_status,
        payment_method=payment_method,
        created_at=created_at,
    )
    db.session.add(stock_entry)

    # Update product quantity
    product = Product.query.get(product_id)
    if product:
        product.quantity = (product.quantity or 0) + int(quantity_received)

    db.session.commit()
    return jsonify(stock_entry.to_dict()), 201
