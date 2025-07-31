from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from datetime import datetime

from models.stock_entries import Stock_Entry
from models.business_setting import Business_Setting
from utils.daraja import initiate_stk_push
from models import db
from models.payment import Payment
from models.sale import Sale
from models.stock_entries import Stock_Entry
from datetime import datetime

payment_bp = Blueprint('payment_bp', __name__)
payment_api = Api(payment_bp)

class Payments(Resource):
    def get(self):
        payments = Payment.query.order_by(Payment.created_at.desc()).all()
        return make_response([p.to_dict() for p in payments], 200)

    def post(self):
       data = request.get_json()
       required = ['direction', 'method', 'amount', 'business_id', 'entry_ids', 'mpesa_value', 'payer_phone', 'account_number']
       missing = [f for f in required if not data.get(f)]
       if missing:
           return make_response({"error": f"Missing required field(s): {', '.join(missing)}"}, 400)
   
       try:
           business_id = data['business_id']
           entry_ids = data['entry_ids']
           method = data['method']
           direction = data['direction']
           amount = float(data['amount'])
           paybill_number = data['mpesa_value']
           payer_phone = data['payer_phone']
           account_number = data['account_number']
   
           settings = Business_Setting.query.filter_by(business_id=business_id).first()
           if not settings:
               return make_response({"error": "Business settings not found"}, 404)
   
           txn_ref = f"TXN{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
   
           entries = Stock_Entry.query.filter(Stock_Entry.id.in_(entry_ids)).all()
           for entry in entries:
               entry.payment_status = "pending"
   
           stock_entry_id = entries[0].id if entries else None
           txn_date = datetime.utcnow()
           receipt = None
   
           # C2B STK Push
           daraja_response = initiate_stk_push(settings, payer_phone, amount, account_number)
   
           payment = Payment(
               direction=direction,
               method=method,
               amount=amount,
               phone_number=payer_phone,
               mpesa_receipt_number=receipt,
               transaction_date=txn_date,
               stock_entry_id=stock_entry_id
           )
   
           db.session.add(payment)
           db.session.commit()
   
           return make_response({
               "message": "STK push initiated",
               "payment": payment.to_dict(),
               "daraja_response": daraja_response  # 👈 include raw API response here
           }, 201)
   
       except Exception as e:
           db.session.rollback()
           import traceback
           traceback.print_exc()
           return make_response({"error": str(e)}, 500)
payment_api.add_resource(Payments, '/backend/payments/mpesa')   

class MpesaCallback(Resource):
    def post(self):
        try:
            payload = request.get_json()
            stk_data = payload.get("Body", {}).get("stkCallback", {})
            metadata = stk_data.get("CallbackMetadata", {}).get("Item", [])

            def extract(name):
                item = next((i for i in metadata if i["Name"] == name), None)
                return item.get("Value") if item else None

            amount = extract("Amount")
            receipt = extract("MpesaReceiptNumber")
            phone = extract("PhoneNumber")
            txn_date_raw = extract("TransactionDate")
            txn_date = datetime.strptime(str(txn_date_raw), "%Y%m%d%H%M%S") if txn_date_raw else datetime.utcnow()

            payment = Payment(
                direction="in",
                method="mpesa",
                amount=amount,
                phone_number=phone,
                mpesa_receipt_number=receipt,
                transaction_date=txn_date
            )
            db.session.add(payment)
            db.session.commit()

            return make_response({"message": "Callback received"}, 200)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)
payment_api.add_resource(MpesaCallback, '/backend/payments/callback')
