import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [users, setUsers] = useState([]); // Initialized as empty arrays
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [music, setMusic] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        console.log("Token found, fetching data...");

        let response = await axios.get("http://localhost:8081/api/admin", { headers: { Authorization: `Bearer ${token}` } });
        const { users, orders, products, music, events } = response.data;
        console.log(users, orders, products, music, events);
        setUsers(users || []); // Safely set data, fallback to empty array
        setOrders(orders || []);
        setProducts(products || []);
        setMusic(music || []);
        setEvents(events || []);
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
          window.location.reload();
        }
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [navigate]);

  const sections = [
    { title: "Users", data: users, link: "/admin/users/", key: "id", label: "username" },
    { title: "Orders", data: orders, link: "/admin/orders/", key: "id", label: "orderNumber" },
    { title: "Products", data: products, link: "/admin/products/", key: "id", label: "name" },
    { title: "Music", data: music, link: "/admin/music/", key: "id", label: "title" },
    { title: "Events", data: events, link: "/admin/event/", key: "id", label: "eventName" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <h1 className="text-5xl font-bold text-[#FFD700] text-center mb-12">Admin Panel</h1>
      
      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center text-xl text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-black bg-opacity-80 p-6 rounded-2xl shadow-xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
              <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-6">{section.title}</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {/* Check if data exists and display */}
                {section.data && section.data.length > 0 ? (
                  section.data.map((item) => (
                    <div key={item[section.key]} className="bg-black bg-opacity-50 p-4 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700]/60 transition-all duration-300">
                      <h3 className="text-xl font-semibold text-[#FFD700]">{item[section.label]}</h3>
                      <button
                        onClick={() => navigate(`${section.link}${item[section.key]}`)}
                        className="mt-2 px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:scale-105 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-300">No data available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
  