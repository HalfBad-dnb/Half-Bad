-- Create products table first
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category VARCHAR(50)
);

-- Create product_colors table
CREATE TABLE IF NOT EXISTS product_colors (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT,
    color VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create product_sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT,
    size VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
