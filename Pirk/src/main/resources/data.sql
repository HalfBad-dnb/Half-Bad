-- Insert test user (password is 'password123')
INSERT INTO users (username, password, email, role, first_name, last_name, is_active, created_at, updated_at)
VALUES ('testuser', '$2a$10$8jf7TJa.4/LuVaGVI8GTk.VVQ2kX5IkHxvVnNJt0ckmjQPDHqbB9G', 'test@example.com', 'ADMIN', 'Test', 'User', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Nike Air Max', 'Classic Nike sneakers with Air cushioning technology', 129.99, 'https://example.com/nike-air-max.jpg', 'Shoes', 50),
('Adidas Ultraboost', 'Running shoes with responsive Boost cushioning', 159.99, 'https://example.com/adidas-ultraboost.jpg', 'Shoes', 35),
('Nike Dri-FIT T-Shirt', 'Moisture-wicking training t-shirt', 29.99, 'https://example.com/nike-drifit.jpg', 'Apparel', 100),
('Under Armour Shorts', 'Lightweight training shorts with pockets', 34.99, 'https://example.com/ua-shorts.jpg', 'Apparel', 75),
('Nike Basketball', 'Official size indoor/outdoor basketball', 24.99, 'https://example.com/nike-basketball.jpg', 'Equipment', 40),
('Adidas Backpack', 'Durable sports backpack with laptop compartment', 44.99, 'https://example.com/adidas-backpack.jpg', 'Accessories', 25),
('Puma Running Jacket', 'Lightweight water-resistant running jacket', 79.99, 'https://example.com/puma-jacket.jpg', 'Apparel', 30),
('Nike Training Mat', 'High-density exercise mat for yoga and training', 39.99, 'https://example.com/nike-mat.jpg', 'Equipment', 20);

-- Insert product colors
INSERT INTO product_colors (product_id, color) VALUES
(1, 'Black'),
(1, 'White'),
(1, 'Red'),
(2, 'Grey'),
(2, 'Blue'),
(3, 'Black'),
(3, 'White'),
(3, 'Navy'),
(4, 'Black'),
(4, 'Grey'),
(5, 'Orange'),
(6, 'Black'),
(7, 'Blue'),
(7, 'Black'),
(8, 'Black');

-- Insert product sizes
INSERT INTO product_sizes (product_id, size) VALUES
(1, '7'),
(1, '8'),
(1, '9'),
(1, '10'),
(2, '7'),
(2, '8'),
(2, '9'),
(2, '10'),
(3, 'S'),
(3, 'M'),
(3, 'L'),
(3, 'XL'),
(4, 'S'),
(4, 'M'),
(4, 'L'),
(4, 'XL'),
(7, 'S'),
(7, 'M'),
(7, 'L'),
(7, 'XL');
