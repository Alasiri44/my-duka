from . import create_app
from flask import make_response
from .controllers.merchant_controller import merchant_bp
from .controllers.business_controller import business_bp
from .controllers.store_controller import store_bp
from .controllers.user_controller import user_bp
from .controllers.category_controller import category_bp
from .controllers.product_controller import product_bp
from flask_bcrypt import Bcrypt

app = create_app()
bcrypt = Bcrypt(app)
app.register_blueprint(merchant_bp)
app.register_blueprint(business_bp)
app.register_blueprint(store_bp)
app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)

@app.route('/')
def index():
    return make_response('<h1>Welcome to myDuka platform</h1>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)