import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderTotal, setOrderTotal] = useState("0.00");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const total = sessionStorage.getItem("orderTotal") || "0.00";
    setOrderTotal(total);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (Object.values(shippingInfo).some((field) => field === "")) {
      alert("Please fill in all shipping details.");
      return;
    }

    sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    sessionStorage.setItem("orderTotal", orderTotal);

    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

    const orderData = {
      shippingInfo,
      paymentInfo: { method: "Credit Card", status: "Pending" },
      cartItems,
      totalAmount: parseFloat(orderTotal),
    };

    console.log("Sending Order Data:", orderData);

    try {
      const response = await fetch("http://localhost:8081/api/order/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(orderData),
        credentials: 'include', // Allow cookies (if necessary)
      });

      if (response.ok) {
        const order = await response.json();
        console.log("Order confirmed:", order);
        navigate("/payment");
      } else {
        const errorText = await response.text();
        console.error("Failed to confirm order:", response.status, errorText);
        alert("Failed to process the order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-transparent border-4 border-yellow-500 rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-yellow-500">Order Summary</h2>
        <div className="text-xl text-yellow-500 font-bold text-center mb-6">
          Total: ${orderTotal}
        </div>

        <form onSubmit={handleProceedToPayment} className="space-y-4">
          <input
            type="text"
            name="name"
            value={shippingInfo.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="postalCode"
            value={shippingInfo.postalCode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <input
            type="text"
            name="country"
            value={shippingInfo.country}
            onChange={handleInputChange}
            placeholder="Country"
            className="w-full px-4 py-2 border-2 border-yellow-500 rounded-md bg-transparent text-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
