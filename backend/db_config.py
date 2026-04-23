import mysql.connector
from mysql.connector import pooling
import os

# MySQL connection configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'Chikoo~~1511'),
    'database': os.environ.get('DB_NAME', 'aroha_shopping'),
    'port': int(os.environ.get('DB_PORT', 3306)),
    'autocommit': False
}

# Connection pool
connection_pool = None

def init_pool():
    """Initialize the MySQL connection pool."""
    global connection_pool
    try:
        connection_pool = pooling.MySQLConnectionPool(
            pool_name="aroha_pool",
            pool_size=10,
            pool_reset_session=True,
            **DB_CONFIG
        )
        print("✅ MySQL connection pool created successfully")
    except mysql.connector.Error as e:
        print(f"❌ Error creating connection pool: {e}")
        raise

def get_connection():
    """Get a connection from the pool."""
    global connection_pool
    if connection_pool is None:
        init_pool()
    return connection_pool.get_connection()
