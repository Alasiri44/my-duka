from flask import Blueprint, make_response, request, session, current_app
from flask_restful import Api, Resource
from ..models.merchant import Merchant
from ..models import db
from sqlalchemy import func
from datetime import datetime, timedelta

from flask_bcrypt import Bcrypt

from ..models import db
from ..models.business import Business
from ..models.store import Store
from ..models.product import Product
from ..models.stock_entries import Stock_Entry
from ..models.batch import Batch
from ..models.user import User
from ..models.supplier import Supplier

bcrypt = Bcrypt()
from flask_mail import Message
from server import mail
from threading import Thread

merchant_bp = Blueprint('merchant_bp', __name__)
api = Api(merchant_bp)

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

class Merchants(Resource):
    def get(self):
        response_dict = [merchant.to_dict() for merchant in Merchant.query.all()]
        return make_response(response_dict, 200)
    def post(self):
        from ..app import bcrypt
        data = request.get_json()
        new_merchant = Merchant(
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            email = data.get('email'),
            phone_number = data.get('phone_number'),
            gender = data.get('gender'),
            password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        )
        response = Merchant.query.filter(Merchant.email == data.get('email')).first()
        if(response):
            return make_response({"message": "The user already exists in the database"}, 404)
        if(new_merchant):
            db.session.add(new_merchant)
            db.session.commit()
            msg = Message(
                subject=f"Merchant Account Creation Successful",
                sender='austinalasiri44@gmail.com',
                recipients=[new_merchant.email],)
            msg.html = f"""Dear {new_merchant.first_name},

        <p>Your Merchant account with MyDuka has been successfully created on MyDuka. You can now log in and create your profile
        and access our services.</p>

        <a href="http://127.0.0.1:5173/login" style="
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;">
            Log In here
        </a>

        <p>If you have any questions or need assistance, contact our support team for help.</p>

        <p>Thank you for choosing MyDuka.</p>

        <p>Regards,<br>
        Austin Alasiri<br>
        MyDuka Team</p>
"""
            response = make_response(new_merchant.to_dict(), 201)
            # Starting background thread
            Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()
            
            return response
        else:
            return make_response({"message": "Failed to create a new merchant"}, 404)
api.add_resource(Merchants, '/merchant')

class Merchant_By_ID(Resource):
    def get(self, id):
        response = Merchant.query.filter(Merchant.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def delete(self, id):
        merchant = Merchant.query.filter(Merchant.id == id).first()
        if(merchant):
            db.session.delete(merchant)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
    def patch(self, id):
        merchant = Merchant.query.filter(Merchant.id == id).first()
        if(merchant):
            for attr in request.get_json():
                setattr(merchant, attr, request.get_json().get(attr))
            db.session.add(merchant)
            db.session.commit()
            return make_response(merchant.to_dict(), 200)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_By_ID, '/merchant/<id>')

class Merchant_Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = Merchant.query.filter_by(email=email).first()

        if user:
            if bcrypt.check_password_hash(user.password_hash, password):
                
                session['email'] = user.email
                session['role'] = 'merchant'
                session['user_id'] = user.id

               
                return make_response({
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": "merchant"
                }, 200)
            else:
                return make_response({"message": "Wrong password"}, 401)
        else:
            return make_response({"message": "The user does not exist in the database"}, 404)
api.add_resource(Merchant_Login, '/merchant/login')



class MerchantDashboard(Resource):
    def get(self, id):
        merchant = Merchant.query.get(id)
        if not merchant:
            return make_response({"message": "Merchant not found"}, 404)

        # 1. Get all businesses linked to the merchant
        businesses = Business.query.filter_by(merchant_id=id).all()
        business_ids = [b.id for b in businesses]

        # 2. Get stores under these businesses
        stores = Store.query.filter(Store.business_id.in_(business_ids)).all()
        store_ids = [s.id for s in stores]

        # 3. Get entries via batches -> store
        entries = db.session.query(Stock_Entry, Product, Supplier, Batch)\
            .join(Product, Stock_Entry.product_id == Product.id)\
            .join(Supplier, Stock_Entry.supplier_id == Supplier.id, isouter=True)\
            .join(Batch, Stock_Entry.batch_id == Batch.id)\
            .filter(Batch.store_id.in_(store_ids))\
            .all()

        # 4. Recent activity (limit to 5 latest)
        recent = sorted(entries, key=lambda e: e[0].created_at, reverse=True)[:5]
        recent_activity = [
            {
                "message": f"Received {entry.quantity_received} x {product.name} from {supplier.name if supplier else 'Unknown Supplier'}",
                "timestamp": entry.created_at
            }
            for entry, product, supplier, batch in recent
        ]

        # 5. Summary cards
        total_businesses = len(businesses)
        total_stores = len(stores)
        unpaid_deliveries = [e[0] for e in entries if e[0].payment_status == "unpaid"]
        outstanding_amount = sum(e.buying_price * e.quantity_received for e in unpaid_deliveries)

        summary = {
            "totalBusinesses": total_businesses,
            "totalStores": total_stores,
            "unpaidDeliveries": len(unpaid_deliveries),
            "outstandingAmount": float(outstanding_amount)
        }

        # 6. Enhance businesses
        business_list = []
        for biz in businesses:
            biz_store_ids = [s.id for s in stores if s.business_id == biz.id]

            # Find products for the business
            product_ids = db.session.query(Product.id).filter_by(business_id=biz.id).all()
            flat_ids = [pid[0] for pid in product_ids]

            spend = db.session.query(func.sum(Stock_Entry.buying_price * Stock_Entry.quantity_received))\
                .join(Batch, Stock_Entry.batch_id == Batch.id)\
                .filter(Stock_Entry.product_id.in_(flat_ids), Batch.store_id.in_(biz_store_ids))\
                .scalar() or 0

            business_list.append({
                "id": biz.id,
                "name": biz.name,
                "industry": biz.industry,
                "status": "Active",
                "store_count": len(biz_store_ids),
                "monthly_spend": float(spend)
            })

        return make_response({
            "summary": summary,
            "businesses": business_list,
            "recent_activity": recent_activity
        }, 200)
api.add_resource(MerchantDashboard, '/merchant/<int:id>/dashboard')