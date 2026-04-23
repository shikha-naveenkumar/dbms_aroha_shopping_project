from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/api/reviews/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    """Get all reviews for a product."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('get_product_reviews'), (product_id,))
        reviews = cursor.fetchall()
        return jsonify(reviews)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@reviews_bp.route('/api/reviews', methods=['POST'])
def add_review():
    """
    Add a review for a product.
    Demonstrates: Transaction with SAVEPOINT and ROLLBACK on failure.
    """
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not all([user_id, product_id, rating]):
        return jsonify({'error': 'user_id, product_id, and rating are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Transaction with savepoint for review insertion
        conn.start_transaction()
        cursor.execute("SAVEPOINT before_review")

        # Validate rating (also enforced by trigger)
        if not (1 <= int(rating) <= 5):
            cursor.execute("ROLLBACK TO before_review")
            conn.rollback()
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400

        cursor.execute(get_query('add_review'), (user_id, product_id, rating, comment))
        conn.commit()

        return jsonify({'message': 'Review added successfully'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
