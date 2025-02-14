import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, calculateOverallTotal } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  const handleCheckout = () => {
    if (cart.length > 0) {
      sessionStorage.setItem("orderTotal", calculateOverallTotal());
      sessionStorage.setItem("cartItems", JSON.stringify(cart)); // Save cart items
      navigate('/checkout');
    } else {
      alert("Your cart is empty!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
            Your Cart
          </h1>
          <p className="text-2xl text-gray-300 mb-12">Review your selected items</p>
        </div>
      </section>

      {/* Cart Content Section */}
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            {cart.length > 0 ? (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-black bg-opacity-50 p-6 rounded-lg border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 flex justify-between items-center"
                  >
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-[#FFD700] mb-2">{item.name}</h3>
                      <p className="text-gray-300">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)} = 
                        <span className="text-[#FFD700] ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-[#FFD700]/20">
                  <div className="text-right mb-6">
                    <span className="text-2xl font-bold text-[#FFD700]">
                      Total: ${calculateOverallTotal()}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-[#FFD700] text-black font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-3 px-6 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl text-[#FFD700] mb-4">Your cart is empty</p>
                <p className="text-gray-300 mb-8">Add some products to get started</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default CartPage;
