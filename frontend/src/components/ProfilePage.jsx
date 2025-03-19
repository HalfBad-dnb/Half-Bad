import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock support agent for simulated responses
  const supportAgent = {
    name: "Support Agent",
    avatar: "/images/support-avatar.png",
    autoResponses: [
      "Hello! How can I help you today?",
      "Thank you for your message. Let me check that for you.",
      "We appreciate your patience. Our team is looking into this.",
      "Is there anything else you'd like to know about your order?",
      "Please feel free to ask if you have any other questions."
    ],
    getRandomResponse: function() {
      return this.autoResponses[Math.floor(Math.random() * this.autoResponses.length)];
    }
  };

  // Fetch User Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("Using token:", token);

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
          console.log("User info response:", response.data);
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user info:", err.response?.data || err.message);
        setError("Failed to fetch user info: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Fetch Orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("Fetching orders with token:", token);
    
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
    
        console.log("Raw orders response:", response);
    
        if (response.status === 200) {
          console.log("Orders data:", response.data);
          setOrders(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
      }
    };

    fetchOrders();
  }, [user]);

  // Initialize mock chat
  useEffect(() => {
    if (!user) return;

    // Simulate connecting to chat
    const timer = setTimeout(() => {
      setIsConnected(true);
      // Add welcome message after connection
      const welcomeMessage = {
        id: Date.now(),
        text: "Welcome to our support chat! How can we help you today?",
        sender: supportAgent.name,
        timestamp: new Date().toISOString(),
        isCurrentUser: false
      };
      setMessages([welcomeMessage]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fade In Effect for Profile Section
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 50);
    setTimeout(() => setContentVisible(true), 100);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: user.username,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage("");
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        text: supportAgent.getRandomResponse(),
        sender: supportAgent.name,
        timestamp: new Date().toISOString(),
        isCurrentUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
      <section className="relative text-center py-12 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className={`text-4xl font-bold text-[#FFD700] mb-4 animate-pulse transition-all duration-1000 ease-in-out ${
              titleVisible ? "opacity-100 transform scale-100 blur-0" : "opacity-0 transform scale-150 blur-sm"
            }`}
          >
            Profile
          </h1>
        </div>
      </section>

      {/* Profile Content Section */}
      <div
        className={`max-w-7xl mx-auto px-4 py-8 transition-all duration-1000 ease-out ${
          contentVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Profile + Chat */}
          <div className="flex flex-col space-y-8">
            {/* Profile Card */}
            <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4">
                  <img
                    src={user.profilePicture || "/images/l2.png"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-[#FFD700] p-1"
                  />
                </div>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-2">{user.username}</h2>
                <p className="text-gray-300 text-lg mb-4">{user.email}</p>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-2 bg-[#FFD700] text-black font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Chat Component */}
            <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 flex flex-col h-96">
              <div className="p-4 border-b border-[#FFD700]/20">
                <h2 className="text-2xl font-bold text-[#FFD700] text-center">Live Chat</h2>
                <div className="flex items-center justify-center mt-1">
                  <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                  <p className="text-center text-gray-300 text-sm">
                    {isConnected ? "Connected" : "Connecting..."}
                  </p>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs md:max-w-sm rounded-xl p-3 ${
                          msg.isCurrentUser 
                            ? 'bg-[#FFD700]/20 text-white' 
                            : 'bg-gray-800 text-gray-300'
                        }`}>
                          {!msg.isCurrentUser && (
                            <div className="font-semibold text-[#FFD700] text-sm mb-1">{msg.sender}</div>
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-center">
                      {isConnected 
                        ? "No messages yet. Start a conversation!" 
                        : "Connecting to chat..."}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="border-t border-[#FFD700]/20 p-4">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                    disabled={!isConnected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !newMessage.trim()}
                    className="bg-[#FFD700] text-black px-4 py-2 rounded-r-lg font-medium hover:bg-[#B8860B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Orders */}
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-6">Order History</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-black bg-opacity-50 p-4 rounded-lg border ${
                      order.paymentInfo?.paymentStatus === 'COMPLETED'
                        ? 'border-green-500/40 hover:border-green-500/60'
                        : 'border-red-500/40 hover:border-red-500/60'
                    } transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#FFD700]">Order #{order.orderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentInfo?.paymentStatus === 'COMPLETED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.paymentInfo?.paymentStatus || 'PENDING'}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-300 text-sm">
                        <span className="text-[#FFD700]">Date:</span>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <span className="text-[#FFD700]">Total:</span> ${order.totalAmount.toFixed(2)}
                      </p>
                      <div className="mt-2">
                        <p className="text-[#FFD700] text-xs">Shipping Address:</p>
                        <p className="text-gray-300 text-xs mt-1">{order.shippingInfo?.address || "Address not available"}</p>
                        <p className="text-gray-300 text-xs">{order.shippingInfo?.city}, {order.shippingInfo?.country}</p>
                      </div>
                      {order.paymentInfo?.paymentStatus === 'COMPLETED' && (
                        <div className="mt-2">
                          <p className="text-[#FFD700] text-xs">Payment Details:</p>
                          <p className="text-gray-300 text-xs mt-1">Card ending in {order.paymentInfo.lastFourDigits}</p>
                          <p className="text-gray-300 text-xs">Paid on {new Date(order.paymentInfo.paymentDate).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
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
          width: 6px;
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
    </div>
  );
}

export default ProfilePage;