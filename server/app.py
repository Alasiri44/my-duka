from . import create_app
from flask import make_response
from .controllers.merchant_controller import merchant_bp

app = create_app()
app.register_blueprint(merchant_bp)

@app.route('/')
def index():
    return make_response('<h1>Welcome to myDuka platform</h1>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)