from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/orders', methods=['POST'])
def place_order():
    """
    Place an order from the user's cart.
    Demonstrates: TRANSACTION, SAVEPOINT, ROLLBACK, SELECT FOR UPDATE, concurrency control.
    """
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Start transaction
        conn.start_transaction()

        # SAVEPOINT before order
        cursor.execute("SAVEPOINT before_order")

        # Get cart items
        cursor.execute(get_query('get_cart'), (user_id,))
        cart_items = cursor.fetchall()

        if not cart_items:
            conn.rollback()
            return jsonify({'error': 'Cart is empty'}), 400

        # Calculate total
        total = sum(float(item['price']) * item['quantity'] for item in cart_items)

        # Verify stock with SELECT FOR UPDATE (concurrency control)
        for item in cart_items:
            cursor.execute(get_query('lock_product_for_update'), (item['product_id'],))
            stock_row = cursor.fetchone()
            if not stock_row or stock_row['stock'] < item['quantity']:
                cursor.execute("ROLLBACK TO before_order")
                conn.rollback()
                return jsonify({
                    'error': f"Insufficient stock for {item['name']}"
                }), 400

        # Create order
        cursor.execute(get_query('create_order'), (user_id, total))
        order_id = cursor.lastrowid

        # Create order items and reduce stock
        for item in cart_items:
            cursor.execute(get_query('create_order_item'), (
                order_id, item['product_id'], item['quantity'], float(item['price'])
            ))
            cursor.execute(get_query('reduce_stock'), (
                item['quantity'], item['product_id'], item['quantity']
            ))

        # Clear cart
        cursor.execute(get_query('clear_cart'), (user_id,))

        # Commit transaction
        conn.commit()

        return jsonify({
            'message': 'Order placed successfully',
            'order_id': order_id,
            'total': total
        }), 201

    except Exception as e:
        # ROLLBACK on any failure (recovery)
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@orders_bp.route('/api/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    """Get all orders for a user."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('get_user_orders'), (user_id,))
        orders = cursor.fetchall()
        for o in orders:
            if o.get('total_amount'):
                o['total_amount'] = float(o['total_amount'])

        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@orders_bp.route('/api/orders/<int:order_id>/items', methods=['GET'])
def get_order_items(order_id):
    """Get items for a specific order."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('get_order_items'), (order_id,))
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

@orders_bp.route('/api/orders/details/<int:user_id>', methods=['GET'])
def get_order_details(user_id):
    """Get detailed order history with product info (JOIN query)."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('user_orders_with_products'), (user_id,))
        rows = cursor.fetchall()
        for r in rows:
            if r.get('total_amount'):
                r['total_amount'] = float(r['total_amount'])
            if r.get('item_price'):
                r['item_price'] = float(r['item_price'])
        return jsonify(rows)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
