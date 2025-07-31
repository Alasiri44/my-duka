from flask import Blueprint, request, make_response
from flask_restful import Api, Resource
from models.stock_exits import StockExit
from models import db
from models.product import Product
from models.user import User
from models.store import Store
from models.batch import Batch
from models.sale import Sale

stock_exit_bp = Blueprint('stock_exit_bp', __name__)
stock_exit_api = Api(stock_exit_bp)


class StockExits(Resource):
    def get(self):
        store_id = request.args.get("store_id", type=int)
        product_id = request.args.get("product_id", type=int)
        reason = request.args.get("reason")
        recorded_by = request.args.get("recorded_by", type=int)

        query = db.session.query(StockExit)\
            .outerjoin(Product, StockExit.product_id == Product.id)\
            .outerjoin(User, StockExit.recorded_by == User.id)\
            .outerjoin(Store, StockExit.store_id == Store.id)\
            .outerjoin(Batch, StockExit.batch_id == Batch.id)\
            .outerjoin(Sale, StockExit.sale_id == Sale.id)

        if store_id:
            query = query.filter(StockExit.store_id == store_id)
        if product_id:
            query = query.filter(StockExit.product_id == product_id)
        if reason:
            query = query.filter(StockExit.reason.ilike(reason))
        if recorded_by:
            query = query.filter(StockExit.recorded_by == recorded_by)

        exits = query.order_by(StockExit.created_at.desc()).all()

        results = []
        for e in exits:
            results.append({
                "id": e.id,
                "store_id": e.store_id,
                "store_name": e.store.name if e.store else None,
                "product_id": e.product_id,
                "product_name": e.product.name if e.product else None,
                "quantity": e.quantity,
                "selling_price": float(e.selling_price) if e.selling_price else 0,
                "reason": e.reason,
                "recorded_by": e.recorded_by,
                "clerk_id": e.user.id if e.user else None,
                "clerk_name": f"{e.user.first_name} {e.user.last_name}".strip() if e.user else "",
                "batch_id": e.batch_id,
                "batch_direction": e.batch.direction if e.batch else None,
                "sale_id": e.sale_id,
                "sale_total": float(e.sale.total_amount) if e.sale and e.sale.total_amount else None,
                "created_at": e.created_at.isoformat(),
            })

        return make_response(results, 200)

    def post(self):
        data = request.get_json()
        try:
            stock_exit = StockExit(
                store_id=data.get('store_id'),
                product_id=data.get('product_id'),
                quantity=data.get('quantity'),
                selling_price=data.get('selling_price'),
                reason=data.get('reason'),
                recorded_by=data.get('recorded_by'),
                batch_id=data.get('batch_id'),
                sale_id=data.get('sale_id')
            )
            db.session.add(stock_exit)
            db.session.commit()
            return make_response(stock_exit.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': f'Error creating stock exit: {str(e)}'}, 400)


stock_exit_api.add_resource(StockExits, '/stock_exits')


class StockExit_By_ID(Resource):
    def get(self, id):
        exit = StockExit.query.get(id)
        if exit:
            d = exit.to_dict()
            d['store_name'] = d.pop('store.name', None)
            d['product_name'] = d.pop('product.name', None)
            d['clerk_id'] = d.pop('user.id', None)
            d['clerk_name'] = f"{d.pop('user.first_name', '')} {d.pop('user.last_name', '')}".strip()
            d['batch_direction'] = d.pop('batch.direction', None)
            d['sale_total'] = d.pop('sale.total_amount', None)
            return make_response(d, 200)
        return make_response({"message": "The stock exit does not exist"}, 404)

    def patch(self, id):
        exit = StockExit.query.get(id)
        if exit:
            data = request.get_json()
            for attr in data:
                setattr(exit, attr, data[attr])
            db.session.commit()
            return make_response(exit.to_dict(), 200)
        return make_response({"message": "The stock exit does not exist"}, 404)

    def delete(self, id):
        exit = StockExit.query.get(id)
        if exit:
            db.session.delete(exit)
            db.session.commit()
            return make_response('', 204)
        return make_response({"message": "The stock exit does not exist"}, 404)


stock_exit_api.add_resource(StockExit_By_ID, '/stock_exits/<int:id>')