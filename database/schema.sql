-- ============================================================
-- AROHA FASHION E-COMMERCE — DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS aroha_shopping;
USE aroha_shopping;

-- ============================================================
-- 1. USER TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS User (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    age         INT,
    gender      ENUM('Male','Female','Other'),
    phone       VARCHAR(15),
    address     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ADMIN TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT IGNORE INTO Admin (admin_id, username, password)
VALUES (1, 'admin', 'admin123');

-- ============================================================
-- 3. CATEGORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Category (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description   TEXT
);

-- Seed categories
INSERT IGNORE INTO Category (category_id, category_name, description) VALUES
(1, 'Men',         'Clothing and accessories for men'),
(2, 'Women',       'Clothing and accessories for women'),
(3, 'Kids',        'Clothing and accessories for kids'),
(4, 'Footwear',    'Shoes, sandals, and boots'),
(5, 'Accessories', 'Bags, watches, jewellery, and more');

-- ============================================================
-- 4. PRODUCT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Product (
    product_id    INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(200)  NOT NULL,
    brand         VARCHAR(100),
    price         DECIMAL(10,2) NOT NULL CHECK (price > 500),
    description   TEXT,
    image_url     VARCHAR(500),
    stock         INT DEFAULT 0,
    category_id   INT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- Seed products
INSERT IGNORE INTO Product (product_id, name, brand, price, description, image_url, stock, category_id) VALUES
(1,  'Classic White Shirt',       'Aroha Basics',   1299.00, 'A timeless white cotton shirt for everyday style.',                     'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 50, 1),
(2,  'Slim Fit Denim Jeans',      'UrbanEdge',      1899.00, 'Modern slim-fit jeans in classic indigo wash.',                         'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 40, 1),
(3,  'Floral Summer Dress',       'BloomStyle',      2499.00, 'Lightweight floral dress perfect for summer outings.',                  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 30, 2),
(4,  'Embroidered Kurti',         'EthnicVibe',      1599.00, 'Hand-embroidered cotton kurti with mirror work.',                       'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 35, 2),
(5,  'Kids Cartoon T-Shirt',      'TinyTrends',       799.00, 'Fun cartoon-print tee for kids, 100% organic cotton.',                  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 60, 3),
(6,  'Running Sneakers',          'SpeedStride',     3499.00, 'Breathable mesh running shoes with cushioned sole.',                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 25, 4),
(7,  'Leather Crossbody Bag',     'Aroha Luxe',      2799.00, 'Genuine leather crossbody bag with adjustable strap.',                  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 20, 5),
(8,  'Analog Wrist Watch',        'TimeKraft',       4999.00, 'Stainless steel analog watch with sapphire crystal glass.',             'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 15, 5),
(9,  'Casual Polo T-Shirt',       'Aroha Basics',    1099.00, 'Classic polo in breathable piqué cotton, available in 6 colours.',      'https://images.unsplash.com/photo-1625910513413-5fc49751e2ac?w=400', 55, 1),
(10, 'High-Waist Palazzo Pants',  'ComfyChic',       1799.00, 'Flowy palazzo pants with elastic waist for all-day comfort.',           'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 40, 2),
(11, 'Kids Denim Dungaree',       'TinyTrends',      1299.00, 'Adorable denim dungaree with adjustable straps.',                       'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 30, 3),
(12, 'Chunky Platform Sandals',   'SoleCraft',       1999.00, 'Trendy platform sandals with cushioned footbed.',                       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', 22, 4),
(13, 'Silver Hoop Earrings',      'Aroha Luxe',       899.00, 'Sterling silver hoop earrings, hypoallergenic.',                        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 70, 5),
(14, 'Bomber Jacket',             'UrbanEdge',       3299.00, 'Lightweight bomber jacket with ribbed cuffs.',                           'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 18, 1),
(15, 'Silk Saree',                'EthnicVibe',      5999.00, 'Pure silk saree with gold zari border, ideal for festive occasions.',    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 10, 2);

-- ============================================================
-- 5. CART TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Cart (
    cart_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT DEFAULT 1,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES User(user_id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Orders (
    order_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status      ENUM('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
    order_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ============================================================
-- 7. ORDER_ITEMS TABLE (line items for each order)
-- ============================================================
CREATE TABLE IF NOT EXISTS Order_Items (
    item_id     INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT DEFAULT 1,
    price       DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES Orders(order_id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- ============================================================
-- 8. REVIEW TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Review (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    product_id  INT NOT NULL,
    rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES User(user_id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- ============================================================
-- 9. BROWSING_HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Browsing_History (
    history_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    product_id   INT NOT NULL,
    viewed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES User(user_id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- ============================================================
-- TRIGGER: Prevent rating > 5 or < 1
-- ============================================================
DELIMITER //

CREATE TRIGGER trg_review_rating_insert
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    IF NEW.rating > 5 THEN
        SET NEW.rating = 5;
    ELSEIF NEW.rating < 1 THEN
        SET NEW.rating = 1;
    END IF;
END //

CREATE TRIGGER trg_review_rating_update
BEFORE UPDATE ON Review
FOR EACH ROW
BEGIN
    IF NEW.rating > 5 THEN
        SET NEW.rating = 5;
    ELSEIF NEW.rating < 1 THEN
        SET NEW.rating = 1;
    END IF;
END //

DELIMITER ;

-- ============================================================
-- VIEW: Expensive Products (price > 2000)
-- ============================================================
CREATE OR REPLACE VIEW expensive_products AS
SELECT product_id, name, brand, price, category_id
FROM Product
WHERE price > 2000;

-- ============================================================
-- VIEW: User Order Summary
-- ============================================================
CREATE OR REPLACE VIEW user_order_summary AS
SELECT
    u.user_id,
    u.name AS user_name,
    COUNT(o.order_id)    AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent
FROM User u
LEFT JOIN Orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;
