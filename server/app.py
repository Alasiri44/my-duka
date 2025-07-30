from . import create_app
from flask import make_response, session, request
from flask_session import Session
from .controllers.merchant_controller import merchant_bp
from .controllers.business_controller import business_bp
from .controllers.store_controller import store_bp
from .controllers.user_controller import user_bp
from .controllers.category_controller import category_bp
from .controllers.product_controller import product_bp
from .controllers.supplier_controller import supplier_bp
from .controllers.supply_request_controller import supply_request_bp
from .controllers.auth import auth_bp
from .controllers.email_controller import email_bp
from .controllers.payment_controller import payment_bp
from server.controllers.stock_exit_controller import stock_exit_bp

from .controllers.stock_entry_controller import stock_entry_bp
from .controllers.batch_controller import batch_bp
from .controllers.sale_controller import sale_bp
from .controllers.mpesa_controller import mpesa_bp

from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = create_app()
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])

app.register_blueprint(merchant_bp)
app.register_blueprint(business_bp)
app.register_blueprint(store_bp)
app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(supply_request_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(stock_exit_bp)
app.register_blueprint(payment_bp)

app.register_blueprint(email_bp)
app.register_blueprint(stock_entry_bp)
app.register_blueprint(batch_bp)
app.register_blueprint(sale_bp)
app.register_blueprint(mpesa_bp)

@app.route('/')
def index():
    return make_response('<h1>Welcome to myDuka platform</h1>')


@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    data = request.get_json()
    print("M-PESA Callback received:")
    print(data)

   

    return make_response(({"ResultCode": 0, "ResultDesc": "Callback received successfully"}), 200)

if __name__ == '__main__':
    app.run(port=5555, debug=True)