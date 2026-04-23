-- ============================================================
-- AROHA FASHION E-COMMERCE — ALL SQL QUERIES
-- ============================================================
-- This file contains EVERY SQL query used in the application.
-- Queries are grouped by feature and labelled with a -- @name tag
-- so the backend can load them by name at runtime.
-- ============================================================

USE aroha_shopping;

-- ************************************************************
-- SECTION 1: BASIC QUERIES
-- ************************************************************

-- @name: users_age_above_22
SELECT * FROM User WHERE age > 22;

-- @name: products_in_price_range
SELECT * FROM Product WHERE price BETWEEN %s AND %s;

-- @name: all_products
SELECT p.*, c.category_name
FROM Product p
LEFT JOIN Category c ON p.category_id = c.category_id
ORDER BY p.created_at DESC;

-- @name: product_by_id
SELECT p.*, c.category_name
FROM Product p
LEFT JOIN Category c ON p.category_id = c.category_id
WHERE p.product_id = %s;

-- @name: products_by_category
SELECT p.*, c.category_name
FROM Product p
LEFT JOIN Category c ON p.category_id = c.category_id
WHERE p.category_id = %s;

-- @name: search_products
SELECT p.*, c.category_name
FROM Product p
LEFT JOIN Category c ON p.category_id = c.category_id
WHERE p.name LIKE %s OR p.brand LIKE %s OR p.description LIKE %s;

-- @name: all_users
SELECT user_id, name, email, age, gender, phone, address, created_at FROM User;

-- @name: user_by_id
SELECT user_id, name, email, age, gender, phone, address, created_at FROM User WHERE user_id = %s;

-- @name: user_by_email
SELECT * FROM User WHERE email = %s;

-- @name: all_categories
SELECT * FROM Category ORDER BY category_name;

-- @name: category_by_id
SELECT * FROM Category WHERE category_id = %s;

-- ************************************************************
-- SECTION 2: AGGREGATE QUERIES
-- ************************************************************

-- @name: avg_product_price
SELECT AVG(price) AS avg_price FROM Product;

-- @name: count_orders
SELECT COUNT(*) AS total_orders FROM Orders;

-- @name: max_product_price
SELECT MAX(price) AS max_price FROM Product;

-- @name: min_product_price
SELECT MIN(price) AS min_price FROM Product;

-- @name: total_revenue
SELECT SUM(total_amount) AS total_revenue FROM Orders;

-- @name: orders_per_user
SELECT u.user_id, u.name, COUNT(o.order_id) AS order_count
FROM User u
LEFT JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;

-- @name: avg_rating_per_product
SELECT p.product_id, p.name, COALESCE(AVG(r.rating), 0) AS avg_rating, COUNT(r.review_id) AS review_count
FROM Product p
LEFT JOIN Review r ON p.product_id = r.product_id
GROUP BY p.product_id, p.name;

-- @name: admin_dashboard_stats
SELECT
    (SELECT COUNT(*) FROM User)    AS total_users,
    (SELECT COUNT(*) FROM Product) AS total_products,
    (SELECT COUNT(*) FROM Orders)  AS total_orders,
    (SELECT COALESCE(SUM(total_amount),0) FROM Orders) AS total_revenue;

-- ************************************************************
-- SECTION 3: SET OPERATIONS
-- ************************************************************

-- @name: union_men_women_products
-- Products in Men OR Women categories
SELECT product_id, name, brand, price FROM Product WHERE category_id = 1
UNION
SELECT product_id, name, brand, price FROM Product WHERE category_id = 2;

-- @name: intersect_ordered_and_reviewed
-- Users who have BOTH ordered AND reviewed (INTERSECT via JOIN)
SELECT DISTINCT u.user_id, u.name
FROM User u
INNER JOIN Orders o ON u.user_id = o.user_id
INNER JOIN Review r ON u.user_id = r.user_id;

-- @name: except_not_ordered
-- Users who have browsed but NOT ordered (EXCEPT via LEFT JOIN)
SELECT DISTINCT u.user_id, u.name
FROM User u
INNER JOIN Browsing_History bh ON u.user_id = bh.user_id
LEFT JOIN Orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;

-- ************************************************************
-- SECTION 4: SUBQUERIES
-- ************************************************************

-- @name: products_above_avg_price
SELECT * FROM Product WHERE price > (SELECT AVG(price) FROM Product);

-- @name: users_with_orders
SELECT * FROM User WHERE user_id IN (SELECT DISTINCT user_id FROM Orders);

-- @name: products_with_reviews
SELECT * FROM Product WHERE product_id IN (SELECT DISTINCT product_id FROM Review);

-- @name: most_expensive_in_each_category
SELECT p.*
FROM Product p
WHERE p.price = (
    SELECT MAX(p2.price* 1)
    FROM Product p2
    WHERE p2.category_id = p.category_id
);

-- ************************************************************
-- SECTION 5: JOINS
-- ************************************************************

-- @name: user_orders_with_products
SELECT o.order_id, o.order_date, o.status, o.total_amount,
       oi.quantity, oi.price AS item_price,
       p.name AS product_name, p.brand, p.image_url
FROM Orders o
JOIN Order_Items oi ON o.order_id = oi.order_id
JOIN Product p ON oi.product_id = p.product_id
WHERE o.user_id = %s
ORDER BY o.order_date DESC;

-- @name: product_with_category
SELECT p.*, c.category_name, c.description AS category_description
FROM Product p
JOIN Category c ON p.category_id = c.category_id;

-- @name: user_reviews_with_products
SELECT r.review_id, r.rating, r.comment, r.review_date,
       p.name AS product_name, p.brand, p.image_url,
       u.name AS user_name
FROM Review r
JOIN User u ON r.user_id = u.user_id
JOIN Product p ON r.product_id = p.product_id
WHERE r.product_id = %s
ORDER BY r.review_date DESC;

-- @name: all_orders_admin
SELECT o.order_id, o.order_date, o.status, o.total_amount,
       u.name AS user_name, u.email
FROM Orders o
JOIN User u ON o.user_id = u.user_id
ORDER BY o.order_date DESC;

-- ************************************************************
-- SECTION 6: CART OPERATIONS
-- ************************************************************

-- @name: get_cart
SELECT c.cart_id, c.quantity, p.product_id, p.name, p.brand, p.price, p.image_url, p.stock
FROM Cart c
JOIN Product p ON c.product_id = p.product_id
WHERE c.user_id = %s;

-- @name: add_to_cart
INSERT INTO Cart (user_id, product_id, quantity) VALUES (%s, %s, %s);

-- @name: update_cart_quantity
UPDATE Cart SET quantity = %s WHERE cart_id = %s AND user_id = %s;

-- @name: remove_from_cart
DELETE FROM Cart WHERE cart_id = %s AND user_id = %s;

-- @name: clear_cart
DELETE FROM Cart WHERE user_id = %s;

-- @name: check_cart_item
SELECT * FROM Cart WHERE user_id = %s AND product_id = %s;

-- @name: increment_cart_quantity
UPDATE Cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s;

-- ************************************************************
-- SECTION 7: ORDER OPERATIONS
-- ************************************************************

-- @name: create_order
INSERT INTO Orders (user_id, total_amount, status) VALUES (%s, %s, 'Pending');

-- @name: create_order_item
INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s);

-- @name: reduce_stock
UPDATE Product SET stock = stock - %s WHERE product_id = %s AND stock >= %s;

-- @name: get_user_orders
SELECT o.order_id, o.total_amount, o.status, o.order_date
FROM Orders o
WHERE o.user_id = %s
ORDER BY o.order_date DESC;

-- @name: get_order_items
SELECT oi.*, p.name AS product_name, p.brand, p.image_url
FROM Order_Items oi
JOIN Product p ON oi.product_id = p.product_id
WHERE oi.order_id = %s;

-- ************************************************************
-- SECTION 8: AUTH OPERATIONS
-- ************************************************************

-- @name: register_user
INSERT INTO User (name, email, password, age, gender, phone, address) VALUES (%s, %s, %s, %s, %s, %s, %s);

-- @name: admin_login
SELECT * FROM Admin WHERE username = %s;

-- ************************************************************
-- SECTION 9: REVIEW OPERATIONS
-- ************************************************************

-- @name: add_review
INSERT INTO Review (user_id, product_id, rating, comment) VALUES (%s, %s, %s, %s);

-- @name: get_product_reviews
SELECT r.review_id, r.rating, r.comment, r.review_date, u.name AS user_name
FROM Review r
JOIN User u ON r.user_id = u.user_id
WHERE r.product_id = %s
ORDER BY r.review_date DESC;

-- ************************************************************
-- SECTION 10: BROWSING HISTORY
-- ************************************************************

-- @name: add_browsing_history
INSERT INTO Browsing_History (user_id, product_id) VALUES (%s, %s);

-- @name: get_browsing_history
SELECT bh.history_id, bh.viewed_at, p.product_id, p.name, p.brand, p.price, p.image_url
FROM Browsing_History bh
JOIN Product p ON bh.product_id = p.product_id
WHERE bh.user_id = %s
ORDER BY bh.viewed_at DESC
LIMIT 50;

-- ************************************************************
-- SECTION 11: RECOMMENDATIONS (SQL-BASED AI)
-- ************************************************************

-- @name: trending_products
-- Most ordered products (top 10)
SELECT p.product_id, p.name, p.brand, p.price, p.image_url,
       COUNT(oi.item_id) AS times_ordered,
       COALESCE(AVG(r.rating), 0) AS avg_rating
FROM Product p
LEFT JOIN Order_Items oi ON p.product_id = oi.product_id
LEFT JOIN Review r ON p.product_id = r.product_id
GROUP BY p.product_id, p.name, p.brand, p.price, p.image_url
ORDER BY times_ordered DESC, avg_rating DESC
LIMIT 10;

-- @name: recommended_by_history
-- Products in the same categories as user's browsing history
SELECT DISTINCT p.product_id, p.name, p.brand, p.price, p.image_url
FROM Product p
WHERE p.category_id IN (
    SELECT DISTINCT p2.category_id
    FROM Browsing_History bh
    JOIN Product p2 ON bh.product_id = p2.product_id
    WHERE bh.user_id = %s
)
AND p.product_id NOT IN (
    SELECT product_id FROM Browsing_History WHERE user_id = %s
)
LIMIT 10;

-- @name: recommended_by_orders
-- Products bought by users who bought the same products as this user
SELECT DISTINCT p.product_id, p.name, p.brand, p.price, p.image_url
FROM Order_Items oi
JOIN Orders o ON oi.order_id = o.order_id
JOIN Product p ON oi.product_id = p.product_id
WHERE o.user_id IN (
    SELECT DISTINCT o2.user_id
    FROM Order_Items oi2
    JOIN Orders o2 ON oi2.order_id = o2.order_id
    WHERE oi2.product_id IN (
        SELECT oi3.product_id
        FROM Order_Items oi3
        JOIN Orders o3 ON oi3.order_id = o3.order_id
        WHERE o3.user_id = %s
    )
    AND o2.user_id != %s
)
AND p.product_id NOT IN (
    SELECT oi4.product_id
    FROM Order_Items oi4
    JOIN Orders o4 ON oi4.order_id = o4.order_id
    WHERE o4.user_id = %s
)
LIMIT 10;

-- @name: highest_rated_products
SELECT p.product_id, p.name, p.brand, p.price, p.image_url,
       AVG(r.rating) AS avg_rating, COUNT(r.review_id) AS review_count
FROM Product p
JOIN Review r ON p.product_id = r.product_id
GROUP BY p.product_id, p.name, p.brand, p.price, p.image_url
HAVING COUNT(r.review_id) >= 1
ORDER BY avg_rating DESC, review_count DESC
LIMIT 10;

-- ************************************************************
-- SECTION 12: ADMIN PRODUCT MANAGEMENT
-- ************************************************************

-- @name: add_product
INSERT INTO Product (name, brand, price, description, image_url, stock, category_id)
VALUES (%s, %s, %s, %s, %s, %s, %s);

-- @name: update_product
UPDATE Product
SET name = %s, brand = %s, price = %s, description = %s, image_url = %s, stock = %s, category_id = %s
WHERE product_id = %s;

-- @name: delete_product
DELETE FROM Product WHERE product_id = %s;

-- ************************************************************
-- SECTION 13: ADMIN CATEGORY MANAGEMENT
-- ************************************************************

-- @name: add_category
INSERT INTO Category (category_name, description) VALUES (%s, %s);

-- @name: update_category
UPDATE Category SET category_name = %s, description = %s WHERE category_id = %s;

-- @name: delete_category
DELETE FROM Category WHERE category_id = %s;

-- ************************************************************
-- SECTION 14: ADMIN ORDER MANAGEMENT
-- ************************************************************

-- @name: update_order_status
UPDATE Orders SET status = %s WHERE order_id = %s;

-- ************************************************************
-- SECTION 15: VIEWS QUERIES
-- ************************************************************

-- @name: get_expensive_products
SELECT * FROM expensive_products;

-- @name: get_user_order_summary
SELECT * FROM user_order_summary;

-- ************************************************************
-- SECTION 16: CURSORS (Stored Procedures)
-- ************************************************************

DELIMITER //

-- Cursor: Display all product names
CREATE PROCEDURE IF NOT EXISTS cursor_product_names()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE pname VARCHAR(200);
    DECLARE cur CURSOR FOR SELECT name FROM Product;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_product_names (product_name VARCHAR(200));
    TRUNCATE TABLE temp_product_names;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO pname;
        IF done THEN LEAVE read_loop; END IF;
        INSERT INTO temp_product_names VALUES (pname);
    END LOOP;
    CLOSE cur;

    SELECT * FROM temp_product_names;
    DROP TEMPORARY TABLE temp_product_names;
END //

-- Cursor: Display all user names
CREATE PROCEDURE IF NOT EXISTS cursor_user_names()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE uname VARCHAR(100);
    DECLARE cur CURSOR FOR SELECT name FROM User;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_user_names (user_name VARCHAR(100));
    TRUNCATE TABLE temp_user_names;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO uname;
        IF done THEN LEAVE read_loop; END IF;
        INSERT INTO temp_user_names VALUES (uname);
    END LOOP;
    CLOSE cur;

    SELECT * FROM temp_user_names;
    DROP TEMPORARY TABLE temp_user_names;
END //

-- Cursor: Display all product prices
CREATE PROCEDURE IF NOT EXISTS cursor_product_prices()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE pname VARCHAR(200);
    DECLARE pprice DECIMAL(10,2);
    DECLARE cur CURSOR FOR SELECT name, price FROM Product;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_product_prices (
        product_name VARCHAR(200),
        product_price DECIMAL(10,2)
    );
    TRUNCATE TABLE temp_product_prices;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO pname, pprice;
        IF done THEN LEAVE read_loop; END IF;
        INSERT INTO temp_product_prices VALUES (pname, pprice);
    END LOOP;
    CLOSE cur;

    SELECT * FROM temp_product_prices;
    DROP TEMPORARY TABLE temp_product_prices;
END //

DELIMITER ;

-- ************************************************************
-- SECTION 17: TRANSACTIONS WITH SAVEPOINT
-- ************************************************************

-- Transaction: Place Order (demonstrated in backend code, template here)
-- START TRANSACTION;
-- SAVEPOINT before_order;
-- INSERT INTO Orders ...;
-- INSERT INTO Order_Items ...;
-- UPDATE Product SET stock = stock - quantity ...;
-- If error: ROLLBACK TO before_order;
-- COMMIT;

-- Transaction: Add Review with rollback
-- START TRANSACTION;
-- SAVEPOINT before_review;
-- INSERT INTO Review ...;
-- If rating invalid: ROLLBACK TO before_review;
-- COMMIT;

-- ************************************************************
-- SECTION 18: CONCURRENCY CONTROL
-- ************************************************************

-- SELECT FOR UPDATE: Lock product row during stock update
-- @name: lock_product_for_update
SELECT stock FROM Product WHERE product_id = %s FOR UPDATE;

-- LOCK TABLE demonstration
-- LOCK TABLES Product WRITE;
-- UPDATE Product SET stock = stock - 1 WHERE product_id = 1;
-- UNLOCK TABLES;

-- ************************************************************
-- SECTION 19: RECOVERY SIMULATION
-- ************************************************************

-- Rollback demonstration
-- START TRANSACTION;
-- DELETE FROM Product WHERE product_id = 999;
-- ROLLBACK;  -- Undo the delete

-- Undo log concept: MySQL InnoDB automatically maintains undo logs.
-- When ROLLBACK is called, InnoDB uses the undo log to reverse changes.
-- This is built into the storage engine and demonstrated by our transaction usage.
