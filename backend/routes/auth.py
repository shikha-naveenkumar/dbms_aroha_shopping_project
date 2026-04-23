from flask import Blueprint, request, jsonify
from db_config import get_connection
from services.sql_loader import get_query
import hashlib

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    """Simple SHA-256 hash for passwords."""
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.json
    required = ['name', 'email', 'password']
    for field in required:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Check if email exists
        cursor.execute(get_query('user_by_email'), (data['email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 409

        # Register user
        cursor.execute(get_query('register_user'), (
            data['name'],
            data['email'],
            hash_password(data['password']),
            data.get('age'),
            data.get('gender'),
            data.get('phone'),
            data.get('address')
        ))
        conn.commit()
        user_id = cursor.lastrowid

        return jsonify({
            'message': 'Registration successful',
            'user': {
                'user_id': user_id,
                'name': data['name'],
                'email': data['email']
            }
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """User login."""
    data = request.json
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('user_by_email'), (data['email'],))
        user = cursor.fetchone()

        if not user or user['password'] != hash_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({
            'message': 'Login successful',
            'user': {
                'user_id': user['user_id'],
                'name': user['name'],
                'email': user['email'],
                'role': 'customer'
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/api/auth/admin/login', methods=['POST'])
def admin_login():
    """Admin login."""
    data = request.json
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(get_query('admin_login'), (data['username'],))
        admin = cursor.fetchone()

        if not admin or admin['password'] != data['password']:
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({
            'message': 'Admin login successful',
            'user': {
                'admin_id': admin['admin_id'],
                'username': admin['username'],
                'role': 'admin'
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
