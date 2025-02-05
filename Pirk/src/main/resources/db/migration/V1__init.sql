-- First, drop all existing tables to start fresh
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS checkouts CASCADE;
DROP TABLE IF EXISTS confirmations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS payment_info CASCADE;
DROP TABLE IF EXISTS shipping_info CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS checkout CASCADE;
DROP TABLE IF EXISTS confirmation CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS user CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;

-- Create tables with proper structure
CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_picture VARCHAR(255),
    address VARCHAR(500),
    bio VARCHAR(1000),
    phone_number VARCHAR(20),
    preferences TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO "user" (username, password, email, role, first_name, last_name) VALUES
('admin', '$2a$10$rS.FFzUgzGhwxXY1hrIUxOYYS0pJ/6X8j9mEJdRKbOQvh3YqMWBTq', 'admin@example.com', 'ADMIN', 'Admin', 'User'),
('user1', '$2a$10$rS.FFzUgzGhwxXY1hrIUxOYYS0pJ/6X8j9mEJdRKbOQvh3YqMWBTq', 'user1@example.com', 'USER', 'John', 'Doe');
-- Note: The password hash above is for 'password123'

CREATE TABLE IF NOT EXISTS product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category VARCHAR(50),
    stock INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_colors (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(id),
    color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS product_sizes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(id),
    size VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id),
    product_id BIGINT REFERENCES product(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "user"(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS confirmation (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    confirmation_code VARCHAR(255) UNIQUE,
    payment_info TEXT,
    shipping_info TEXT,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmation_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO product (name, price, description, image_url, category, stock) VALUES
('Nike Air Max', 129.99, 'Classic Nike Air Max sneakers with superior comfort and style', 'https://example.com/nike-air-max.jpg', 'SHOES', 10),
('Adidas Ultraboost', 159.99, 'High-performance running shoes with responsive cushioning', 'https://example.com/adidas-ultraboost.jpg', 'SHOES', 15),
('Puma RS-X', 99.99, 'Retro-style sneakers with modern technology', 'https://example.com/puma-rsx.jpg', 'SHOES', 20),
('Nike Dri-FIT T-Shirt', 29.99, 'Moisture-wicking athletic t-shirt', 'https://example.com/nike-drifit.jpg', 'CLOTHING', 30),
('Adidas Track Pants', 49.99, 'Comfortable athletic pants for training', 'https://example.com/adidas-pants.jpg', 'CLOTHING', 25),
('Under Armour Hoodie', 59.99, 'Warm and comfortable athletic hoodie', 'https://example.com/ua-hoodie.jpg', 'CLOTHING', 20),
('Nike Basketball', 24.99, 'Professional indoor/outdoor basketball', 'https://example.com/nike-ball.jpg', 'EQUIPMENT', 40),
('Adidas Soccer Ball', 19.99, 'Training soccer ball', 'https://example.com/adidas-ball.jpg', 'EQUIPMENT', 35),
('Fitness Mat', 15.99, 'Non-slip exercise mat for yoga and fitness', 'https://example.com/fitness-mat.jpg', 'EQUIPMENT', 50);

-- Insert sample colors for products
INSERT INTO product_colors (product_id, color) VALUES
(1, 'BLACK'),
(1, 'WHITE'),
(1, 'RED'),
(2, 'BLUE'),
(2, 'WHITE'),
(3, 'GRAY'),
(3, 'BLACK');

-- Insert sample sizes for products
INSERT INTO product_sizes (product_id, size) VALUES
(1, '40'),
(1, '41'),
(1, '42'),
(1, '43'),
(2, '39'),
(2, '40'),
(2, '41'),
(2, '42'),
(3, '40'),
(3, '41'),
(3, '42');
