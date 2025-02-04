import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome, faCity, faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
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
            <div className="text-xl text-yellow-500 font-bold text-center mb-6">Total: ${orderTotal}</div>

            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {[
                { name: "name", icon: faUser, placeholder: "Full Name" },
                { name: "address", icon: faHome, placeholder: "Address" },
                { name: "city", icon: faCity, placeholder: "City" },
                { name: "postalCode", icon: faEnvelope, placeholder: "Postal Code" },
                { name: "country", icon: faGlobe, placeholder: "Country" },
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
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                    required
                  />
                </div>
              ))}

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
