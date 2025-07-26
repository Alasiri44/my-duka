from flask import Blueprint, request, jsonify, make_response
from ..models.batch import Batch

batch_bp = Blueprint('batch_bp', __name__)

@batch_bp.route('/batches', methods=['GET'])
def get_batches():
    store_id = request.args.get('store_id')
    if store_id:
        batches = Batch.query.filter_by(store_id=store_id).all()
    else:
        batches = Batch.query.all()
    return jsonify([batch.to_dict() for batch in batches])