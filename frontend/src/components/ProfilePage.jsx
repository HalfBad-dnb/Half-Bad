import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // Initialize as empty array
  const [error, setError] = useState("");
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch User Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("Using token:", token); // Debug log

        if (!token) {
          console.error("No token found in session storage");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data) {
          console.log("User info response:", response.data); // Debug log
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user info:", err.response?.data || err.message);
        setError("Failed to fetch user info: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          // Handle unauthorized error
          console.log("Unauthorized access, redirecting to login");
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Fetch Orders
  useEffect(() => {
    if (!user) return; // Don't fetch orders if user is not loaded

    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("Using token for orders:", token); // Debug log

        if (!token) {
          console.error("No token found in session storage");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("Orders response:", response.data); // Debug log
          // Ensure orders is always an array
          setOrders(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
      }
    };

    fetchOrders();
  }, [user]);

  // Fade In Effect for Profile Section
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 500);
    setTimeout(() => setContentVisible(true), 1000);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000]">
        <div className="text-yellow-500 font-semibold text-xl">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Profile Title Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${
              titleVisible ? "opacity-100 transform scale-100 blur-0" : "opacity-0 transform scale-150 blur-sm"
            }`}
          >
            Profile
          </h1>
          <p className="text-2xl text-gray-300 mb-12">View your profile and order history</p>
        </div>
      </section>

      {/* Profile Content Section */}
      <div
        className={`max-w-7xl mx-auto px-4 py-12 transition-all duration-1000 ease-out ${
          contentVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Card */}
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 relative mb-6">
                <img
                  src={user.profilePicture || "/images/l2.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#FFD700] p-1"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#FFD700] mb-2">{user.username}</h2>
              <p className="text-gray-300 text-lg mb-6">{user.email}</p>
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Order History</h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-black bg-opacity-50 p-6 rounded-lg border ${
                      order.paymentInfo?.paymentStatus === 'COMPLETED'
                        ? 'border-green-500/40 hover:border-green-500/60'
                        : 'border-red-500/40 hover:border-red-500/60'
                    } transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-[#FFD700]">Order #{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.paymentInfo?.paymentStatus === 'COMPLETED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.paymentInfo?.paymentStatus || 'PENDING'}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-300">
                        <span className="text-[#FFD700]">Date:</span>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-[#FFD700]">Total:</span> ${order.totalAmount.toFixed(2)}
                      </p>
                      <div className="mt-3">
                        <p className="text-[#FFD700]">Shipping Address:</p>
                        <p className="text-gray-300 text-sm mt-1">{order.shippingInfo?.address || "Address not available"}</p>
                        <p className="text-gray-300 text-sm">{order.shippingInfo?.city}, {order.shippingInfo?.country}</p>
                      </div>
                      {order.paymentInfo?.paymentStatus === 'COMPLETED' && (
                        <div className="mt-3">
                          <p className="text-[#FFD700]">Payment Details:</p>
                          <p className="text-gray-300 text-sm mt-1">Card ending in {order.paymentInfo.lastFourDigits}</p>
                          <p className="text-gray-300 text-sm">Paid on {new Date(order.paymentInfo.paymentDate).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#FFD700] text-lg">No orders yet</p>
                  <p className="text-gray-300 mt-2">Your order history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B8860B;
        }
        `}
      </style>

      <footer className="mt-auto bg-black bg-opacity-90 text-gray-400 py-4 text-center">
        <p> 2025 All Rights Reserved. HALF BAD</p>
        <div className="mt-2">
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="mailto:your-email@example.com" className="hover:text-white">Email</a>
            </li>
            <li>
              <a href="https://www.facebook.com/pusiaublogas/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            </li>
            <li>
              <a href="https://www.instagram.com/half_bad_dnb/?locale=en%2F" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default ProfilePage;
