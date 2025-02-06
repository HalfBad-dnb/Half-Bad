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
    cardholderName: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const shippingInfo = sessionStorage.getItem('shippingInfo');
    const cart = sessionStorage.getItem('cart');
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login', { state: { returnUrl: '/payment' } });
      return;
    }

    if (!shippingInfo || !cart) {
      navigate('/checkout');
      return;
    }

    try {
      const cartData = JSON.parse(cart);
      const shippingData = JSON.parse(shippingInfo);
      
      // Validate cart data
      if (!Array.isArray(cartData) || cartData.length === 0) {
        console.error('Invalid cart data');
        navigate('/cart');
        return;
      }

      // Calculate total
      const total = cartData.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        const quantity = parseInt(item.quantity || 0, 10);
        if (isNaN(price) || isNaN(quantity)) {
          console.warn('Invalid price or quantity for item:', item);
          return sum;
        }
        return sum + (price * quantity);
      }, 0);

      setOrderTotal(total);
      console.log('Order total:', total);

      // Validate shipping data
      if (!shippingData || !shippingData.name || !shippingData.address) {
        console.error('Invalid shipping data');
        navigate('/checkout');
        return;
      }

      // Generate order ID if not exists
      let orderId = sessionStorage.getItem('orderId');
      if (!orderId) {
        orderId = Date.now(); // Just use timestamp as orderId
        sessionStorage.setItem('orderId', orderId);
      }
    } catch (error) {
      console.error('Error processing data:', error);
      navigate('/cart');
      return;
    }

    // Set up protection against browser back/forward
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, '', window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
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

  const validateCardholderName = (name) => {
    if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
      return 'Please enter a valid cardholder name';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Format card number with spaces every 4 digits
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expirationDate') {
      // Format expiration date as MM/YY
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    } else if (name === 'cvv') {
      // Only allow numbers for CVV
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'cardholderName') {
      // Only allow letters and spaces for cardholder name
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setPaymentInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'cardholderName':
        if (!value.trim()) {
          error = 'Please enter a valid cardholder name';
        }
        break;
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
    
    // Prevent double submission
    if (isSubmitting) return;

    const { cardNumber, expirationDate, cvv, cardholderName } = paymentInfo;
    
    // Validate all fields
    const errors = {
      cardNumber: validateCardNumber(cardNumber),
      expirationDate: validateExpirationDate(expirationDate),
      cvv: validateCVV(cvv),
      cardholderName: validateCardholderName(cardholderName)
    };

    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const orderId = sessionStorage.getItem('orderId');
      if (!orderId) {
        throw new Error('No order found');
      }

      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      const last4 = cleanCardNumber.slice(-4);
      
      // Use hardcoded API URL for now - in production this should be in .env
      const API_URL = 'http://localhost:8081';
      const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cardNumber: cleanCardNumber,
          expirationDate,
          cvv,
          orderId: parseInt(sessionStorage.getItem('orderId') || '0', 10),
          cardholderName: cardholderName.trim()
        })
      });

      if (!response.ok) {
        let errorMessage = 'Payment failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Clear sensitive data
      setPaymentInfo({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardholderName: ''
      });
      
      // Clear cart and session data
      clearCart();
      sessionStorage.removeItem('cart');
      sessionStorage.removeItem('orderId');
      sessionStorage.removeItem('shippingInfo');
      
      navigate('/order-confirmation', { 
        state: { 
          orderId: data.orderId,
          last4,
          cardholderName
        }
      });
    } catch (error) {
      setErrorMessage(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto bg-black bg-opacity-80 backdrop-blur-md border-4 border-yellow-500 rounded-xl shadow-lg p-8 mt-8">
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
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-300">
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              type="text"
              name="cardholderName"
              value={paymentInfo.cardholderName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                formErrors.cardholderName ? 'border-red-500' : ''
              }`}
              autoComplete="cc-name"
            />
            {formErrors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.cardholderName}</p>
            )}
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
                Expiration Date
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
                type="password"
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
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-yellow-500 text-black rounded-lg font-semibold transition-all
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
          >
            {isSubmitting ? 'Processing...' : 'Pay Securely'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
