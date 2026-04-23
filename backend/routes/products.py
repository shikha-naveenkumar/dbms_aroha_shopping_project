from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    """Get all products, optionally filtered by category or search."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        category_id = request.args.get('category_id')
        search = request.args.get('search')

        if category_id:
            cursor.execute(get_query('products_by_category'), (category_id,))
        elif search:
            term = f'%{search}%'
            cursor.execute(get_query('search_products'), (term, term, term))
        else:
            cursor.execute(get_query('all_products'))

        products = cursor.fetchall()
        # Convert Decimal to float for JSON
        for p in products:
            if p.get('price'):
                p['price'] = float(p['price'])
        return jsonify(products)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@products_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('product_by_id'), (product_id,))
        product = cursor.fetchone()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        if product.get('price'):
            product['price'] = float(product['price'])
        return jsonify(product)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@products_bp.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('all_categories'))
        categories = cursor.fetchall()
        return jsonify(categories)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
