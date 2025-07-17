from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from .models import db
from .models.merchant import Merchant
from .models.business import Business
from .models.store import Store
from .models.user import User
from .models.category import Category

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
    migrate = Migrate(app, db)
    db.init_app(app)
    CORS(app)
    return app
