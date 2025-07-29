from flask_cors import CORS  # ✅ Add this at the top

def create_app():
    app = Flask(__name__)
    app.secret_key = "super-secret-key"
    
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
    
    # Session configuration
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config["SESSION_COOKIE_DOMAIN"] = "127.0.0.1"
    
    # 🧩 CORS configuration
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"  # 👈 your actual Vite origin
    ])
    
    # Initializing extensions
    migrate = Migrate(app, db)
    db.init_app(app)
    mail.init_app(app)
    sess.init_app(app)

    return app
