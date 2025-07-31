from flask import Blueprint, request, jsonify, make_response
from models.batch import Batch

batch_bp = Blueprint('batch_bp', __name__)

@batch_bp.route('/batches', methods=['GET', 'POST'])
def batches():
    if request.method == 'GET':
        store_id = request.args.get('store_id')
        if store_id:
            batches = Batch.query.filter_by(store_id=store_id).all()
        else:
            batches = Batch.query.all()
        return jsonify([batch.to_dict() for batch in batches])
    elif request.method == 'POST':
        data = request.get_json()
        store_id = data.get('store_id')
        direction = data.get('direction')
        party = data.get('party')
        created_by = data.get('created_by')
        if not all([store_id, direction, party, created_by]):
            return jsonify({'error': 'Missing required fields'}), 400
        batch = Batch(store_id=store_id, direction=direction, party=party, created_by=created_by)
        from models import db
        db.session.add(batch)
        db.session.commit()
        return jsonify(batch.to_dict()), 201