import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome, faCity, faEnvelope, faGlobe, faCreditCard, faCalendar, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    email: "",
    postalCode: "",
    country: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is logged in first
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Get stored user info first
        const storedUsername = sessionStorage.getItem('username');
        const storedEmail = sessionStorage.getItem('email');

        if (storedUsername && storedEmail) {
          setShippingInfo(prevInfo => ({
            ...prevInfo,
            fullName: storedUsername,
            email: storedEmail
          }));
        }

        // Verify token by making a request to the user info endpoint
        const token = sessionStorage.getItem('token');
        console.log('Using token:', token);

        const response = await axios.get('http://localhost:8081/api/user/info', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        console.log('User info response:', response);
        console.log('User info:', response.data);

        // Update shipping info with latest data from server
        if (response.data) {
          setShippingInfo(prevInfo => ({
            ...prevInfo,
            fullName: response.data.username || prevInfo.fullName,
            email: response.data.email || prevInfo.email
          }));
        }
      } catch (err) {
        console.error('Auth error:', err);
        const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to verify authentication';
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Token invalid or expired, redirecting to login');
          sessionStorage.removeItem('token');
          navigate('/login', { state: { from: location.pathname } });
        } else {
          setError(errorMessage);
          console.error('Detailed error:', err.response?.data);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
        throw new Error('Please fill in all shipping details');
      }

      console.log('Starting checkout process...');

      // Get current user info
      console.log('Fetching user info...');
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      const userResponse = await axios.get('http://localhost:8081/api/user/info', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      console.log('User info received:', userResponse.data);

      // Create order with shipping info and total amount
      console.log('Creating order...');
      
      // Get cart items from session storage
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      console.log('Cart from session:', cart);
      
      const orderData = {
        shippingInfo: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country
        },
        cartItems: cart.map(item => ({
          product: {
            id: item.id
          },
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        status: 'PENDING',
        userId: userResponse.data.id
      };
      
      console.log('Sending order data:', orderData);
      
      const orderResponse = await axios.post(
        'http://localhost:8081/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log('Order created:', orderResponse.data);

      // Store shipping info and order ID in session storage
      sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
      sessionStorage.setItem('orderId', orderResponse.data.id);

      // Redirect to payment page
      navigate('/payment');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4">Checkout</h1>
          <p className="text-xl text-gray-300">Complete your shipping information</p>
        </div>
      </section>

      {/* Checkout Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-xl">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#FFD700] mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faCity} className="mr-2" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-6 ${
                isProcessing ? 'bg-gray-500' : 'bg-[#FFD700] hover:bg-[#B8860B]'
              } text-black font-bold rounded-lg transition-colors duration-200`}
            >
              {isProcessing ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
