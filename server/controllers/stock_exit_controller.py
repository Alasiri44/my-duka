from flask import Blueprint, request, make_response
from flask_restful import Api, Resource
from ..models.stock_exits import StockExit
from ..models import db

stock_exit_bp = Blueprint('stock_exit_bp', __name__)
stock_exit_api = Api(stock_exit_bp)


class StockExits(Resource):
    def get(self):
        # Optional filters
        store_id = request.args.get("store_id", type=int)
        product_id = request.args.get("product_id", type=int)
        reason = request.args.get("reason")
        recorded_by = request.args.get("recorded_by", type=int)

        query = StockExit.query

        if store_id:
            query = query.filter(StockExit.store_id == store_id)
        if product_id:
            query = query.filter(StockExit.product_id == product_id)
        if reason:
            query = query.filter(StockExit.reason.ilike(reason))
        if recorded_by:
            query = query.filter(StockExit.recorded_by == recorded_by)

        results = []
        for exit in query.all():
            d = exit.to_dict()
            d['store_name'] = d.pop('store.name', None)
            d['product_name'] = d.pop('product.name', None)
            d['clerk_id'] = d.pop('user.id', None)
            d['clerk_name'] = f"{d.pop('user.first_name', '')} {d.pop('user.last_name', '')}".strip()
            d['batch_direction'] = d.pop('batch.direction', None)
            d['sale_total'] = d.pop('sale.total_amount', None)
            results.append(d)

        return make_response(results, 200)

    def post(self):
        data = request.get_json()
        print("Incoming payload:", data)

        new_exit = StockExit(
            store_id=data.get('store_id'),
            product_id=data.get('product_id'),
            recorded_by=data.get('recorded_by'),
            batch_id=data.get('batch_id'),
            quantity=data.get('quantity'),
            selling_price=data.get('selling_price'),
            reason=data.get('reason'),
            sale_id=data.get('sale_id')  # Optional
        )

        try:
            db.session.add(new_exit)
            db.session.commit()
            return make_response(new_exit.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({"message": "Failed to create stock exit", "error": str(e)}, 400)


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