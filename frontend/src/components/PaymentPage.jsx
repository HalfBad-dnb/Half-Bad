import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Prevent redirection if checkout is not completed
  useEffect(() => {
    const shippingInfo = sessionStorage.getItem('shippingInfo');
    if (!shippingInfo) {
      navigate('/checkout'); // Redirect to checkout if no shipping info found
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (value.length > 16) return;
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, ''); // Allow only numbers
      if (value.length > 4) return; // CVV should be 3 or 4 digits
    }

    if (name === 'expirationDate') {
      value = value.replace(/[^0-9/]/g, ''); // Allow only numbers and '/'
      if (value.length === 2 && !value.includes('/')) {
        value += '/'; // Auto-insert slash after MM
      }
      if (value.length > 5) return; // Prevent extra input
    }

    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const isExpirationDateValid = (expDate) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expDate)) return false;

    const [month, year] = expDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year
    const currentMonth = new Date().getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const { cardNumber, expirationDate, cvv } = paymentInfo;

    const isCardValid = /^\d{16}$/.test(cardNumber);
    const isCvvValid = /^\d{3,4}$/.test(cvv);
    const isDateValid = isExpirationDateValid(expirationDate);

    if (!(isCardValid && isCvvValid && isDateValid)) {
      setErrorMessage('Please fill in all payment details correctly.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to proceed with payment');
        navigate('/login');
        return;
      }

      const orderId = sessionStorage.getItem('orderId');
      if (!orderId) {
        alert('No order found. Please try again.');
        navigate('/checkout');
        return;
      }

      const response = await fetch('http://localhost:8081/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderId,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expirationDate,
          cvv
        })
      });

      if (response.ok) {
        const result = await response.json();
        sessionStorage.setItem('paymentInfo', JSON.stringify(result));
        navigate('/order-confirmation');
      } else {
        const error = await response.text();
        setErrorMessage(error || 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred while processing your payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-transparent border-4 border-yellow-500 rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-yellow-500">Payment Details</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleInputChange}
            placeholder="Card Number (16 digits)"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
            maxLength={16}
          />
          <input
            type="text"
            name="expirationDate"
            value={paymentInfo.expirationDate}
            onChange={handleInputChange}
            placeholder="Expiration Date (MM/YY)"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
            maxLength={5}
          />
          <input
            type="text"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
            placeholder="CVV (3 or 4 digits)"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
            maxLength={4}
          />
          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;