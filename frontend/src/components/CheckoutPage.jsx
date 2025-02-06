import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome, faCity, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderTotal, setOrderTotal] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    // Check if user is logged in first
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { returnUrl: '/checkout' } });
      return;
    }

    // Then check if cart is empty
    const storedCart = sessionStorage.getItem('cart');
    if (!storedCart) {
      navigate('/cart');
      return;
    }

    // Calculate total
    try {
      const cartItems = JSON.parse(storedCart);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        console.error('Cart is empty or invalid');
        navigate('/cart');
        return;
      }

      const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        const quantity = parseInt(item.quantity || 0, 10);
        if (isNaN(price) || isNaN(quantity)) {
          console.warn('Invalid price or quantity for item:', item);
          return sum;
        }
        return sum + (price * quantity);
      }, 0);

      console.log('Cart items:', cartItems);
      console.log('Calculated total:', total);
      setOrderTotal(total.toFixed(2));
    } catch (error) {
      console.error('Error processing cart:', error);
      navigate('/cart');
    }
  }, [navigate]);

  // Handle input changes for shipping info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    setValidationErrors(prev => ({ ...prev, [name]: '' }));

    // Validate postal code immediately
    if (name === 'postalCode') {
      const postalCodeRegex = /^[0-9]{5}$/;
      if (!postalCodeRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, postalCode: 'Invalid postal code format' }));
      } else {
        setValidationErrors(prev => ({ ...prev, postalCode: '' }));
      }
    }
  };

  // Submit the order and navigate to payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate required fields
    const fields = {
      name: 'Name',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country'
    };

    Object.entries(fields).forEach(([field, label]) => {
      if (!shippingInfo[field].trim()) {
        errors[field] = `${label} is required`;
      }
    });

    // Validate postal code format
    const postalCodeRegex = /^[0-9]{5}$/;
    if (shippingInfo.postalCode && !postalCodeRegex.test(shippingInfo.postalCode)) {
      errors.postalCode = 'Invalid postal code format';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Save shipping info and navigate to payment
    sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-[#FFD700] mb-6 animate-pulse">Checkout</h1>
          <p className="text-2xl text-gray-300 mb-12">Complete your order</p>
        </div>
      </section>

      {/* Checkout Form Section */}
      <div className="relative py-20 px-8 z-30">
        <div className="relative z-10 max-w-md mx-auto">
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <h2 className="text-2xl font-semibold text-center text-[#FFD700] mb-6">Order Summary</h2>
            <div className="text-xl text-yellow-500 font-bold text-center mb-6">Total: ${typeof orderTotal === 'number' ? orderTotal.toFixed(2) : orderTotal}</div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "name", icon: faUser, placeholder: "Full Name" },
                { name: "address", icon: faHome, placeholder: "Address" },
                { name: "city", icon: faCity, placeholder: "City" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    <FontAwesomeIcon icon={field.icon} className="mr-2" /> {field.placeholder}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={shippingInfo[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400 ${validationErrors[field.name] ? 'border-red-500' : ''}`}
                  />
                  {validationErrors[field.name] && (
                    <p className="text-red-500 text-sm mt-2">{validationErrors[field.name]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className={`w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400 ${validationErrors.postalCode ? 'border-red-500' : ''}`}
                />
                {validationErrors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                )}
              </div>
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={`w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400 ${validationErrors.country ? 'border-red-500' : ''}`}
                />
                {validationErrors.country && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.country}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-all duration-300"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
