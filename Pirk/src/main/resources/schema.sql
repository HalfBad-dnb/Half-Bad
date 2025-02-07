-- Drop existing constraints and tables if they exist
DROP TABLE IF EXISTS payment_info CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shipping_info CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table first (as it's referenced by other tables)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_picture VARCHAR(255),
    address VARCHAR(500),
    bio VARCHAR(1000),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_password_change TIMESTAMP,
    last_login_at TIMESTAMP,
    preferences VARCHAR(1000)
);

-- Create products table (referenced by other tables)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(100),
    stock INTEGER DEFAULT 0
);

-- Create product_colors table
CREATE TABLE product_colors (
    product_id BIGINT NOT NULL,
    color VARCHAR(50) NOT NULL,
    CONSTRAINT fk_product_colors FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create product_sizes table
CREATE TABLE product_sizes (
    product_id BIGINT NOT NULL,
    size VARCHAR(50) NOT NULL,
    CONSTRAINT fk_product_sizes FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create shipping_addresses table
CREATE TABLE shipping_addresses (
    id BIGSERIAL PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20)
);

-- Create shipping_info table (referenced by orders)
CREATE TABLE shipping_info (
    id BIGSERIAL PRIMARY KEY,
    recipient_name VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20)
);

-- Create carts table
CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_price DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    CONSTRAINT fk_user_cart FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    order_number VARCHAR(50) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_info_id BIGINT,
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_shipping_info FOREIGN KEY (shipping_info_id) REFERENCES shipping_info(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create cart_items table (depends on both carts and products)
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT NOT NULL,
    order_id BIGINT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create payment_info table (depends on orders)
CREATE TABLE payment_info (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    card_number VARCHAR(255),
    expiry_date VARCHAR(7),
    cvv VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_cart_items_order_id ON cart_items(order_id);
CREATE INDEX idx_payment_info_order_id ON payment_info(order_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
