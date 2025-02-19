import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleBack = () => {
    navigate("/AdminPanel");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFC500] transition-colors"
        >
          Back to Admin Panel
        </button>
        <h1 className="text-4xl font-bold text-[#FFD700]">Orders Management</h1>
      </div>

      {loading ? (
        <div className="text-center text-xl text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <div className="bg-black bg-opacity-80 rounded-xl shadow-xl">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FFD700]/10 text-[#FFD700]">
                    <th className="px-6 py-3 text-left">Order Number</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-gray-700 hover:bg-[#FFD700]/5 transition-colors"
                    >
                      <td className="px-6 py-4">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.user?.username || 'N/A'}</td>
                      <td className="px-6 py-4">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                          order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {order.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No orders found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;