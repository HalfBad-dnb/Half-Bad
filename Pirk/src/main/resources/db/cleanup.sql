-- Drop duplicate tables
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS checkouts CASCADE;
DROP TABLE IF EXISTS confirmations CASCADE;

-- Rename tables to use plural form (standard convention)
ALTER TABLE IF EXISTS cart RENAME TO carts;
ALTER TABLE IF EXISTS cart_item RENAME TO cart_items;
ALTER TABLE IF EXISTS user RENAME TO users;
ALTER TABLE IF EXISTS product RENAME TO products;
ALTER TABLE IF EXISTS checkout RENAME TO checkouts;
ALTER TABLE IF EXISTS confirmation RENAME TO confirmations;
