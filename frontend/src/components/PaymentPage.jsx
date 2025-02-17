import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for success message

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const orderId = sessionStorage.getItem('orderId');
    const orderTotal = sessionStorage.getItem('orderTotal');

    if (!token) {
      navigate('/login', { state: { returnUrl: '/payment' } });
      return;
    }

    if (!orderId || !orderTotal) {
      console.error('Missing order data:', { orderId, orderTotal });
      navigate('/checkout');
      return;
    }

    setOrderTotal(parseFloat(orderTotal));
  }, [navigate]);

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleaned)) {
      return 'Card number must be exactly 16 digits';
    }
    return '';
  };

  const validateExpirationDate = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      return 'Expiration date must be in MM/YY format';
    }

    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (parseInt(year) < currentYear || 
       (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Card has expired';
    }

    return '';
  };

  const validateCVV = (cvv) => {
    if (!/^\d{3,4}$/.test(cvv)) {
      return 'CVV must be 3 or 4 digits';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expirationDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'cardNumber':
        if (!value.trim()) {
          error = 'Card number is required';
        } else if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) {
          error = 'Card number must be exactly 16 digits';
        }
        break;
      case 'expirationDate':
        if (!value.trim()) {
          error = 'Expiration date is required';
        } else {
          const [month, year] = value.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;

          if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            error = 'Card has expired';
          } else if (parseInt(month) < 1 || parseInt(month) > 12) {
            error = 'Invalid month';
          }
        }
        break;
      case 'cvv':
        if (!value.trim()) {
          error = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(value)) {
          error = 'CVV must be 3 or 4 digits';
        }
        break;
      default:
        break;
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const { cardNumber, expirationDate, cvv } = paymentInfo;
    
    const errors = {
      cardNumber: validateCardNumber(cardNumber),
      expirationDate: validateExpirationDate(expirationDate),
      cvv: validateCVV(cvv),
    };

    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const token = sessionStorage.getItem('token');
      const orderId = sessionStorage.getItem('orderId');
      const userId = sessionStorage.getItem('userId');

      if (!token || !orderId || !userId) {
        throw new Error('Missing required data for payment');
      }

      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      const last4 = cleanCardNumber.slice(-4);
      
      try {
        const response = await fetch('http://localhost:8081/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            cardNumber: cleanCardNumber,
            expirationDate,
            cvv,
            orderId: parseInt(orderId, 10),
            buyerId: parseInt(userId, 10),
            last4,
            amount: orderTotal
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          switch (response.status) {
            case 402:
              throw new Error(data.message || 'Payment validation failed');
            case 409:
              throw new Error('This order has already been paid for');
            case 400:
              throw new Error(data.message || 'Invalid payment details');
            case 401:
              sessionStorage.clear();
              navigate('/login', { state: { returnUrl: '/payment' } });
              throw new Error('Session expired. Please login again.');
            default:
              throw new Error(data.message || 'Payment processing failed');
          }
        }

        if (data.status === 'success' && data.paymentInfo.paymentStatus === 'COMPLETED') {
          setPaymentInfo({
            cardNumber: '',
            expirationDate: '',
            cvv: '',
          });
          
          clearCart();
          sessionStorage.removeItem('cart');
          sessionStorage.removeItem('orderId');
          sessionStorage.removeItem('orderTotal');

          setPaymentSuccess(true); // Set payment success to true
        } else {
          throw new Error(data.message || 'Payment was not completed successfully');
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          throw new Error('Unable to connect to payment service. Please try again later.');
        }
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto bg-black bg-opacity-80 backdrop-blur-md border-4 border-yellow-500 rounded-xl shadow-lg p-8 mt-8">
        {paymentSuccess ? (
          <div className="text-center text-xl font-semibold text-green-500">
            Payment Successful! Thank you for your purchase!
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8">Secure Payment</h1>
            
            {errorMessage && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-yellow-500">Order Total</h2>
                <p className="text-2xl font-bold text-white">${orderTotal.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    formErrors.cardNumber ? 'border-red-500' : ''
                  }`}
                  autoComplete="cc-number"
                />
                {formErrors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-300">
                    Expiration Date (MM/YY)
                  </label>
                  <input
                    id="expirationDate"
                    type="text"
                    name="expirationDate"
                    value={paymentInfo.expirationDate}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      formErrors.expirationDate ? 'border-red-500' : ''
                    }`}
                    autoComplete="cc-exp"
                  />
                  {formErrors.expirationDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.expirationDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-300">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="123"
                    className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      formErrors.cvv ? 'border-red-500' : ''
                    }`}
                    autoComplete="cc-csc"
                  />
                  {formErrors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-yellow-500 text-black font-bold rounded disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
