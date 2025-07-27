from flask import Flask
from flask_migrate import Migrate
from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, MAIL_DEFAULT_SENDER, MAIL_PASSWORD, MAIL_PORT, MAIL_SERVER, MAIL_USE_TLS, MAIL_USERNAME
from .models import db
from .models.merchant import Merchant
from .models.business import Business
from .models.store import Store
from .models.user import User
from .models.category import Category
from .models.product import Product
from .models.business_setting import Business_Setting
from .models.supplier import Supplier
from .models.supply_request import Supply_Request
from .models.stock_entries import Stock_Entry
from .models.batch import Batch
from .models.Invites import Invite
from .models.stock_exits import StockExit
from .models.sale import Sale
from flask_mail import Mail
from flask_session import Session
from datetime import timedelta

mail = Mail()
sess = Session()

def create_app():
    app = Flask(__name__)
    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
    
    # Mail configuration
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    app.config['MAIL_DEFAULT_SENDER'] = MAIL_DEFAULT_SENDER
    
    #Session configuration
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config["SESSION_COOKIE_DOMAIN"] = "127.0.0.1"

    # app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
    # app.config["SESSION_COOKIE_SECURE"] = True
    
    #Initializing extensions
    migrate = Migrate(app, db)
    db.init_app(app)
    mail.init_app(app)
    sess.init_app(app)
    return app
