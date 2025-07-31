from __init__  import create_app
from flask import make_response, session, request, send_from_directory, current_app
from flask_session import Session
from controllers.merchant_controller import merchant_bp
from controllers.business_controller import business_bp
from controllers.store_controller import store_bp
from controllers.user_controller import user_bp
from controllers.category_controller import category_bp
from controllers.product_controller import product_bp
from controllers.supplier_controller import supplier_bp
from controllers.supply_request_controller import supply_request_bp
from controllers.auth import auth_bp
from controllers.email_controller import email_bp
from controllers.payment_controller import payment_bp
from controllers.stock_exit_controller import stock_exit_bp

from controllers.stock_entry_controller import stock_entry_bp
from controllers.batch_controller import batch_bp
from controllers.sale_controller import sale_bp
from controllers.mpesa_controller import mpesa_bp
from controllers.reports_controller import reports_bp
from scripts.seed_db import run_seed

from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

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
app.register_blueprint(reports_bp)
app.register_blueprint(email_bp)
app.register_blueprint(stock_entry_bp)
app.register_blueprint(batch_bp)
app.register_blueprint(sale_bp)
app.register_blueprint(mpesa_bp)

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_vue(path):  # name doesn't matter
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    data = request.get_json()
    print("M-PESA Callback received:")
    print(data)

    # Optionally, save to DB or log file

    return make_response(({"ResultCode": 0, "ResultDesc": "Callback received successfully"}), 200)

@app.route('/run-seed')
def seed_route():
    try:
        with current_app.app_context():
            run_seed()
        return {"message": "Database seeded successfully."}, 200
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(port=5555, debug=True)