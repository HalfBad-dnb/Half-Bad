-- First, update any existing NULL buyer_id values to a default value (e.g., 1 for admin)
UPDATE payment_info SET buyer_id = 1 WHERE buyer_id IS NULL;

-- Then, add the NOT NULL constraint
ALTER TABLE payment_info ALTER COLUMN buyer_id SET NOT NULL;
