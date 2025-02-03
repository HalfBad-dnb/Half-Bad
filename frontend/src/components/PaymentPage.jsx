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
      navigate('/checkout');  // Redirect to checkout if no shipping info found
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const { cardNumber, expirationDate, cvv } = paymentInfo;

    // Simple validation (you can expand this with more complex checks)
    const isCardValid = /^\d{16}$/.test(cardNumber); // Check if card number is 16 digits
    const isExpirationDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate); // Check if expiration date is in MM/YY format

    if (isCardValid && isExpirationDateValid && cvv) {
      sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
      navigate('/order-confirmation');
    } else {
      setErrorMessage('Please fill in all payment details correctly.');
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
            placeholder="Card Number"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="expirationDate"
            value={paymentInfo.expirationDate}
            onChange={handleInputChange}
            placeholder="Expiration Date (MM/YY)"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
            placeholder="CVV"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
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
