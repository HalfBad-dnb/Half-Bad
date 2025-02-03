import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const shippingInfo = JSON.parse(sessionStorage.getItem("shippingInfo"));
    const paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
    const orderTotal = sessionStorage.getItem("orderTotal");
    
    if (shippingInfo && paymentInfo) {
      setOrderDetails({
        shippingInfo,
        paymentInfo,
        totalAmount: parseFloat(orderTotal || "0"),
      });

      // Only show the confirmation after a delay
      setTimeout(() => {
        setVisible(true);
      }, 500);
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  useEffect(() => {
    const submitOrder = async () => {
      if (!orderDetails || isSubmitted) return;

      try {
        setIsSubmitted(true); // Prevent duplicate submissions

        // Create a sanitized version of payment info (excluding sensitive data)
        const sanitizedPaymentInfo = {
          cardNumber: `****${orderDetails.paymentInfo.cardNumber.slice(-4)}`,
          expirationDate: orderDetails.paymentInfo.expirationDate,
          cvv: "***"
        };

        const orderData = {
          orderNumber: Math.random().toString(36).substr(2, 9),
          orderDate: new Date().toISOString(),
          totalAmount: orderDetails.totalAmount,
          shippingInfo: {
            name: orderDetails.shippingInfo.name,
            address: orderDetails.shippingInfo.address,
            city: orderDetails.shippingInfo.city,
            postalCode: orderDetails.shippingInfo.postalCode,
            country: orderDetails.shippingInfo.country
          },
          paymentInfo: sanitizedPaymentInfo
        };

        await axios.post(
          "http://localhost:8081/api/order/submit",
          orderData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Clear session storage after successful order
        sessionStorage.removeItem("shippingInfo");
        sessionStorage.removeItem("paymentInfo");
        sessionStorage.removeItem("orderTotal");

      } catch (err) {
        console.error("Failed to submit order:", err);
        setError("Failed to submit order. Please try again.");
        setIsSubmitted(false); // Reset submission state on error
      }
    };

    submitOrder();
  }, [orderDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-transparent border-4 border-yellow-500 rounded-xl shadow-lg p-8 mt-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {orderDetails ? (
          <>
            <h2
              className={`text-3xl font-semibold mb-6 text-center text-yellow-500 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-150'}`}
            >
              Order Confirmation
            </h2>
            <div className="text-yellow-500 mb-4">
              <h3 className="text-xl font-semibold">Shipping Information:</h3>
              <p>Name: {orderDetails.shippingInfo.name}</p>
              <p>Address: {orderDetails.shippingInfo.address}</p>
              <p>City: {orderDetails.shippingInfo.city}</p>
              <p>Postal Code: {orderDetails.shippingInfo.postalCode}</p>
              <p>Country: {orderDetails.shippingInfo.country}</p>
            </div>
            <div className="text-yellow-500">
              <h3 className="text-xl font-semibold">Payment Information:</h3>
              <p>Card Number: **** **** **** {orderDetails.paymentInfo.cardNumber.slice(-4)}</p>
              <p>Expiration Date: {orderDetails.paymentInfo.expirationDate}</p>
            </div>
            <div className="text-yellow-500 mt-4">
              <h3 className="text-xl font-semibold">Order Total:</h3>
              <p>${orderDetails.totalAmount.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl text-yellow-500">Thank you for your order!</h3>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
              >
                Return to Home
              </button>
            </div>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
