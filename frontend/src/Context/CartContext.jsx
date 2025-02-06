import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart state with sessionStorage or default to an empty array
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = sessionStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from sessionStorage:', error);
      return [];
    }
  });

  // Load cart from sessionStorage when the component mounts
  useEffect(() => {
    try {
      const storedCart = sessionStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error parsing cart from sessionStorage:', error);
      setCart([]);
    }
  }, []);

  // Save cart to sessionStorage whenever cart state changes
  useEffect(() => {
    if (cart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate the overall total for the cart
  const calculateOverallTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity } // Increment quantity if product exists
            : item
        );
      }
      // Add new item to the cart if it doesn't exist
      return [...prevCart, { ...product, quantity: product.quantity }];
    });
  };

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      // Immediately update sessionStorage
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Clear the cart and save the total before clearing
  const clearCart = () => {
    sessionStorage.setItem("orderTotal", calculateOverallTotal()); // Save total before clearing
    sessionStorage.removeItem("cart"); // Remove cart from sessionStorage
    setCart([]); // Clear the cart state
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, calculateOverallTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
