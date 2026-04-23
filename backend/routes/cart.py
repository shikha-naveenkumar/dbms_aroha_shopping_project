from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    """Get all cart items for a user."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('get_cart'), (user_id,))
        items = cursor.fetchall()
        for item in items:
            if item.get('price'):
                item['price'] = float(item['price'])
        return jsonify(items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    """Add a product to cart."""
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not user_id or not product_id:
        return jsonify({'error': 'user_id and product_id are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Check if product already in cart
        cursor.execute(get_query('check_cart_item'), (user_id, product_id))
        existing = cursor.fetchone()

        if existing:
            # Increment quantity
            cursor.execute(get_query('increment_cart_quantity'), (quantity, user_id, product_id))
        else:
            cursor.execute(get_query('add_to_cart'), (user_id, product_id, quantity))

        conn.commit()
        return jsonify({'message': 'Added to cart'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@cart_bp.route('/api/cart/<int:cart_id>', methods=['PUT'])
def update_cart(cart_id):
    """Update cart item quantity."""
    data = request.json
    user_id = data.get('user_id')
    quantity = data.get('quantity')

    if not user_id or quantity is None:
        return jsonify({'error': 'user_id and quantity are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if quantity <= 0:
            cursor.execute(get_query('remove_from_cart'), (cart_id, user_id))
        else:
            cursor.execute(get_query('update_cart_quantity'), (quantity, cart_id, user_id))
        conn.commit()
        return jsonify({'message': 'Cart updated'})

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@cart_bp.route('/api/cart/<int:cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    """Remove an item from cart."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('remove_from_cart'), (cart_id, int(user_id)))
        conn.commit()
        return jsonify({'message': 'Removed from cart'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
