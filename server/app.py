from . import create_app
from flask import make_response, session
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
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = create_app()
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config["SESSION_COOKIE_DOMAIN"] = "127.0.0.1"
Session(app)
app.register_blueprint(merchant_bp)
app.register_blueprint(business_bp)
app.register_blueprint(store_bp)
app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(supply_request_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def index():
    return make_response('<h1>Welcome to myDuka platform</h1>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)