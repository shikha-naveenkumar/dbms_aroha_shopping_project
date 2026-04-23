from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/api/recommendations/trending', methods=['GET'])
def trending():
    """Get trending products (most ordered + highest rated)."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('trending_products'))
        products = cursor.fetchall()
        for p in products:
            if p.get('price'):
                p['price'] = float(p['price'])
            if p.get('avg_rating'):
                p['avg_rating'] = float(p['avg_rating'])
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@recommendations_bp.route('/api/recommendations/<int:user_id>', methods=['GET'])
def personalized(user_id):
    """
    Get personalized recommendations based on:
    1. Browsing history (same categories)
    2. Collaborative filtering (similar users' purchases)
    3. Highest-rated products as fallback
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        recommendations = []

        # 1. Based on browsing history
        cursor.execute(get_query('recommended_by_history'), (user_id, user_id))
        history_recs = cursor.fetchall()
        recommendations.extend(history_recs)

        # 2. Based on similar users' orders
        cursor.execute(get_query('recommended_by_orders'), (user_id, user_id, user_id))
        order_recs = cursor.fetchall()
        recommendations.extend(order_recs)

        # 3. Fallback: highest rated
        if len(recommendations) < 5:
            cursor.execute(get_query('highest_rated_products'))
            rated_recs = cursor.fetchall()
            recommendations.extend(rated_recs)

        # Deduplicate by product_id
        seen = set()
        unique = []
        for r in recommendations:
            if r['product_id'] not in seen:
                seen.add(r['product_id'])
                if r.get('price'):
                    r['price'] = float(r['price'])
                if r.get('avg_rating'):
                    r['avg_rating'] = float(r['avg_rating'])
                unique.append(r)

        return jsonify(unique[:10])

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
