"""
Aroha Fashion E-Commerce — Flask Application Entry Point
"""
from flask import Flask
from flask_cors import CORS
from db_config import init_pool

# Import blueprints
from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.reviews import reviews_bp
from routes.history import history_bp
from routes.recommendations import recommendations_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register all blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(recommendations_bp)
    app.register_blueprint(admin_bp)

    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'app': 'Aroha Shopping'}

    return app

if __name__ == '__main__':
    # Initialize DB pool on startup
    init_pool()
    app = create_app()
    print("🛍️  Aroha Shopping Backend running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
