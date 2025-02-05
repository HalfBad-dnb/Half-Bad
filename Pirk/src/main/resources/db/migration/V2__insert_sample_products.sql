-- Insert sample products
INSERT INTO products (name, price, description, image_url, category) VALUES
('Nike Air Max', 129.99, 'Classic Nike Air Max sneakers with superior comfort and style', 'https://example.com/nike-air-max.jpg', 'SHOES'),
('Adidas Ultraboost', 159.99, 'High-performance running shoes with responsive cushioning', 'https://example.com/adidas-ultraboost.jpg', 'SHOES'),
('Puma RS-X', 99.99, 'Retro-style sneakers with modern technology', 'https://example.com/puma-rsx.jpg', 'SHOES'),
('Nike Dri-FIT T-Shirt', 29.99, 'Moisture-wicking athletic t-shirt', 'https://example.com/nike-drifit.jpg', 'CLOTHING'),
('Adidas Track Pants', 49.99, 'Comfortable athletic pants for training', 'https://example.com/adidas-pants.jpg', 'CLOTHING'),
('Under Armour Hoodie', 59.99, 'Warm and comfortable athletic hoodie', 'https://example.com/ua-hoodie.jpg', 'CLOTHING'),
('Nike Basketball', 24.99, 'Professional indoor/outdoor basketball', 'https://example.com/nike-ball.jpg', 'EQUIPMENT'),
('Adidas Soccer Ball', 19.99, 'Training soccer ball', 'https://example.com/adidas-ball.jpg', 'EQUIPMENT'),
('Fitness Mat', 15.99, 'Non-slip exercise mat for yoga and fitness', 'https://example.com/fitness-mat.jpg', 'EQUIPMENT');

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
