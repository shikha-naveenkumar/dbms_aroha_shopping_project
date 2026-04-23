from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

history_bp = Blueprint('history', __name__)

@history_bp.route('/api/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    """Get browsing history for a user."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('get_browsing_history'), (user_id,))
        history = cursor.fetchall()
        for h in history:
            if h.get('price'):
                h['price'] = float(h['price'])
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@history_bp.route('/api/history', methods=['POST'])
def add_history():
    """Record a product view in browsing history."""
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')

    if not user_id or not product_id:
        return jsonify({'error': 'user_id and product_id are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('add_browsing_history'), (user_id, product_id))
        conn.commit()
        return jsonify({'message': 'History recorded'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
