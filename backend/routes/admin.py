from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

admin_bp = Blueprint('admin', __name__)

# ── DASHBOARD ──────────────────────────────────────────

@admin_bp.route('/api/admin/dashboard', methods=['GET'])
def dashboard():
    """Get admin dashboard statistics."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('admin_dashboard_stats'))
        stats = cursor.fetchone()
        if stats.get('total_revenue'):
            stats['total_revenue'] = float(stats['total_revenue'])
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ── PRODUCTS ───────────────────────────────────────────

@admin_bp.route('/api/admin/products', methods=['POST'])
def add_product():
    """Add a new product."""
    data = request.json
    required = ['name', 'price', 'category_id']
    for f in required:
        if f not in data:
            return jsonify({'error': f'{f} is required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('add_product'), (
            data['name'], data.get('brand', ''), data['price'],
            data.get('description', ''), data.get('image_url', ''),
            data.get('stock', 0), data['category_id']
        ))
        conn.commit()
        return jsonify({'message': 'Product added', 'product_id': cursor.lastrowid}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route('/api/admin/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update an existing product."""
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('update_product'), (
            data['name'], data.get('brand', ''), data['price'],
            data.get('description', ''), data.get('image_url', ''),
            data.get('stock', 0), data['category_id'], product_id
        ))
        conn.commit()
        return jsonify({'message': 'Product updated'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('delete_product'), (product_id,))
        conn.commit()
        return jsonify({'message': 'Product deleted'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ── CATEGORIES ─────────────────────────────────────────

@admin_bp.route('/api/admin/categories', methods=['POST'])
def add_category():
    """Add a new category."""
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('add_category'), (
            data['category_name'], data.get('description', '')
        ))
        conn.commit()
        return jsonify({'message': 'Category added', 'category_id': cursor.lastrowid}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route('/api/admin/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update a category."""
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('update_category'), (
            data['category_name'], data.get('description', ''), category_id
        ))
        conn.commit()
        return jsonify({'message': 'Category updated'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route('/api/admin/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('delete_category'), (category_id,))
        conn.commit()
        return jsonify({'message': 'Category deleted'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ── ORDERS ─────────────────────────────────────────────

@admin_bp.route('/api/admin/orders', methods=['GET'])
def get_all_orders():
    """Get all orders (admin view)."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('all_orders_admin'))
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

@admin_bp.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    """Update order status."""
    data = request.json
    status = data.get('status')
    if not status:
        return jsonify({'error': 'status is required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('update_order_status'), (status, order_id))
        conn.commit()
        return jsonify({'message': 'Order status updated'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ── USERS ──────────────────────────────────────────────

@admin_bp.route('/api/admin/users', methods=['GET'])
def get_all_users():
    """Get all registered users."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('all_users'))
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
