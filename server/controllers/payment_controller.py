from flask import Blueprint, request, make_response
from flask_restful import Api, Resource
from ..models import db
from ..models.payment import Payment
from ..models.sale import Sale
from ..models.stock_entries import Stock_Entry
from datetime import datetime

payment_bp = Blueprint('payment_bp', __name__)
payment_api = Api(payment_bp)


def parse_transaction_date(val):
    if val and isinstance(val, int):
        return datetime.strptime(str(val), "%Y%m%d%H%M%S")
    return None


class Payments(Resource):
    def get(self):
        payments = Payment.query.order_by(Payment.created_at.desc()).all()
        return make_response([p.to_dict() for p in payments], 200)

    def post(self):
        data = request.get_json()
        try:
            payment = Payment(
                direction=data['direction'],
                method=data['method'],
                amount=data['amount'],
                sale_id=data.get('sale_id'),
                stock_entry_id=data.get('stock_entry_id'),
                mpesa_receipt_number=data.get('mpesa_receipt_number'),
                phone_number=data.get('phone_number'),
                transaction_date=parse_transaction_date(data.get('transaction_date'))
            )
            db.session.add(payment)
            db.session.commit()
            return make_response(payment.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)


payment_api.add_resource(Payments, '/payments')


class MpesaCallback(Resource):
    def post(self):
        callback_data = request.get_json()
        stk = callback_data.get("Body", {}).get("stkCallback", {})

        if stk.get("ResultCode") != 0:
            return make_response({"message": "Transaction failed or cancelled."}, 200)

        meta = stk.get("CallbackMetadata", {}).get("Item", [])
        values = {item['Name']: item.get('Value') for item in meta}

        try:
            payment = Payment(
                direction="outgoing",
                method="mpesa",
                amount=values.get("Amount"),
                mpesa_receipt_number=values.get("MpesaReceiptNumber"),
                phone_number=str(values.get("PhoneNumber")),
                transaction_date=parse_transaction_date(values.get("TransactionDate"))
            )
            db.session.add(payment)
            db.session.commit()
            return make_response({"message": "Payment recorded."}, 201)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)


payment_api.add_resource(MpesaCallback, '/mpesa/callback')


class PaymentsByEntry(Resource):
    def get(self, entry_id):
        payments = Payment.query.filter_by(stock_entry_id=entry_id).order_by(Payment.created_at.desc()).all()
        return make_response([p.to_dict() for p in payments], 200)


class PaymentsBySale(Resource):
    def get(self, sale_id):
        payments = Payment.query.filter_by(sale_id=sale_id).order_by(Payment.created_at.desc()).all()
        return make_response([p.to_dict() for p in payments], 200)


payment_api.add_resource(PaymentsByEntry, '/payments/by_entry/<int:entry_id>')
payment_api.add_resource(PaymentsBySale, '/payments/by_sale/<int:sale_id>')
