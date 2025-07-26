from flask import Blueprint, request, jsonify, make_response
from ..models.stock_entries import Stock_Entry
from ..models.batch import Batch
from ..models.product import Product
from ..models import db

stock_entry_bp = Blueprint('stock_entry_bp', __name__)

@stock_entry_bp.route('/stock_entries', methods=['GET'])
def get_stock_entries():
    store_id = request.args.get('store_id')
    if not store_id:
        return make_response({'error': 'store_id is required'}, 400)
    entries = db.session.query(Stock_Entry).join(Batch).filter(Batch.store_id == store_id).all()
    result = []
    for entry in entries:
        product = Product.query.get(entry.product_id)
        entry_dict = entry.to_dict()
        entry_dict['product_name'] = product.name if product else None
        entry_dict['stock_quantity'] = product.quantity if product else None
        result.append(entry_dict)
    return jsonify(result)