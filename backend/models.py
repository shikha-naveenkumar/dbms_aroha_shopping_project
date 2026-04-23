"""
Aroha Shopping — Database Models (Reference Only)

This file documents the database table structures.
All actual SQL is in database/schema.sql
All queries are in database/queries.sql
"""

TABLES = {
    "User": {
        "columns": {
            "user_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "name": "VARCHAR(100) NOT NULL",
            "email": "VARCHAR(150) NOT NULL UNIQUE",
            "password": "VARCHAR(255) NOT NULL",
            "age": "INT",
            "gender": "ENUM('Male','Female','Other')",
            "phone": "VARCHAR(15)",
            "address": "TEXT",
            "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Admin": {
        "columns": {
            "admin_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "username": "VARCHAR(100) NOT NULL UNIQUE",
            "password": "VARCHAR(255) NOT NULL",
            "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Category": {
        "columns": {
            "category_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "category_name": "VARCHAR(100) NOT NULL UNIQUE",
            "description": "TEXT",
        }
    },
    "Product": {
        "columns": {
            "product_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "name": "VARCHAR(200) NOT NULL",
            "brand": "VARCHAR(100)",
            "price": "DECIMAL(10,2) NOT NULL CHECK (price > 500)",
            "description": "TEXT",
            "image_url": "VARCHAR(500)",
            "stock": "INT DEFAULT 0",
            "category_id": "INT FK -> Category",
            "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Cart": {
        "columns": {
            "cart_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "user_id": "INT FK -> User",
            "product_id": "INT FK -> Product",
            "quantity": "INT DEFAULT 1",
            "added_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Orders": {
        "columns": {
            "order_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "user_id": "INT FK -> User",
            "total_amount": "DECIMAL(10,2) NOT NULL",
            "status": "ENUM('Pending','Processing','Shipped','Delivered','Cancelled')",
            "order_date": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Order_Items": {
        "columns": {
            "item_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "order_id": "INT FK -> Orders",
            "product_id": "INT FK -> Product",
            "quantity": "INT DEFAULT 1",
            "price": "DECIMAL(10,2) NOT NULL",
        }
    },
    "Review": {
        "columns": {
            "review_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "user_id": "INT FK -> User",
            "product_id": "INT FK -> Product",
            "rating": "INT NOT NULL CHECK (rating BETWEEN 1 AND 5)",
            "comment": "TEXT",
            "review_date": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    },
    "Browsing_History": {
        "columns": {
            "history_id": "INT AUTO_INCREMENT PRIMARY KEY",
            "user_id": "INT FK -> User",
            "product_id": "INT FK -> Product",
            "viewed_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        }
    }
}
