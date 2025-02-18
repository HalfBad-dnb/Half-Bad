import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [users, setUsers] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

        let response = await axios.get("http://localhost:8081/api/admin", { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        const { users, orders, products } = response.data;
        console.log(users, orders, products);
        setUsers(users || []);
        setOrders(orders || []);
        setProducts(products || []);
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
          window.location.reload();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const sections = [
    { title: "Users", data: users, key: "id", label: "username", link: "/admin/users" },
    { title: "Orders", data: orders, key: "id", label: "orderNumber" },
    { title: "Products", data: products, key: "id", label: "name" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <h1 className="text-5xl font-bold text-[#FFD700] text-center mb-12">Admin Panel</h1>
      
      {loading ? (
        <div className="text-center text-xl text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div 
              key={section.title} 
              className="bg-black bg-opacity-80 p-6 rounded-2xl shadow-xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 cursor-pointer"
              onClick={() => section.link && navigate(section.link)}
            >
              <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-6">{section.title}</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {section.data.length > 0 ? (
                  section.data.map((item) => (
                    <div key={item[section.key]} className="bg-black bg-opacity-50 p-4 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700]/60 transition-all duration-300">
                      <h3 className="text-xl font-semibold text-[#FFD700]">{item[section.label]}</h3>
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
