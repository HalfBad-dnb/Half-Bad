import React from 'react';
import { useCart } from '../Context/CartContext';

const CartItem = ({ item }) => {
  const { cart, setCart } = useCart();

  return (
    <div className="cart-item flex justify-between items-center border-b py-2">
      <span>{item.name} - ${item.price}</span>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
