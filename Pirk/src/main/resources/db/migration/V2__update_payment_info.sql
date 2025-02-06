-- Drop existing constraints and tables if they exist
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS fk_payment_info;
DROP TABLE IF EXISTS payment_info CASCADE;

-- Create payment_info table with proper constraints
CREATE TABLE payment_info (
    id BIGSERIAL PRIMARY KEY,
    cardholder_name VARCHAR(255) NOT NULL,
    last_four_digits VARCHAR(4),
    order_id BIGINT NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    buyer_id BIGINT NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
);
