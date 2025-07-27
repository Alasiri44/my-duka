from flask import Blueprint, request, jsonify, make_response
from flask_cors import CORS
from ..models.sale import Sale
from ..models import db
from datetime import datetime

sale_bp = Blueprint('sale_bp', __name__)
CORS(sale_bp)

SALE_FIELDS = {
    'store_id',
    'recorded_by',
    'payment_method',
    'total_amount',
    'customer_name',
    'customer_contact',
    'notes',
    'created_at'
}

REQUIRED_FIELDS = {
    'store_id',
    'recorded_by',
    'payment_method',
    'total_amount'
}

@sale_bp.route('/sales', methods=['POST'])
def create_sale():
    try:
        data = request.get_json()
        if not data:
            return make_response({'error': 'No input data provided'}, 400)
        sale_data = {k: v for k, v in data.items() if k in SALE_FIELDS}
        print('DEBUG: Incoming sale_data:', sale_data)
        missing = [field for field in REQUIRED_FIELDS if field not in sale_data or sale_data[field] is None]
        print('DEBUG: Missing fields:', missing)
        if missing:
            return make_response({'error': f"Missing required fields: {', '.join(missing)}"}, 400)

        # Parse total_amount as Decimal if needed
        if isinstance(sale_data['total_amount'], str):
            try:
                from decimal import Decimal
                sale_data['total_amount'] = Decimal(sale_data['total_amount'])
            except Exception:
                return make_response({'error': 'Invalid total_amount format'}, 400)

        # Parse created_at if provided
        if sale_data.get('created_at'):
            try:
                # Accept both ISO string and datetime object
                if isinstance(sale_data['created_at'], str):
                    sale_data['created_at'] = datetime.fromisoformat(sale_data['created_at'].replace('Z', '+00:00'))
            except Exception:
                return make_response({'error': 'Invalid created_at format'}, 400)

        sale = Sale(**sale_data)
        db.session.add(sale)
        db.session.commit()
        return jsonify(sale.to_dict() if hasattr(sale, 'to_dict') else {'id': sale.id}), 201

    except Exception as e:
        print(f"Error creating sale: {e}")
        # Always return an 'error' field for frontend consistency
        return make_response({'error': 'Internal server error', 'details': str(e)}, 500)

@sale_bp.route('/sales', methods=['GET'])
def get_sales():
    sales = Sale.query.all()
    return jsonify([sale.to_dict() if hasattr(sale, 'to_dict') else {'id': sale.id} for sale in sales])