import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (err) {
        setError("Failed to fetch users: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  // Animate title and content on load
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 500);
    setTimeout(() => setContentVisible(true), 1000);
  }, []);

  // Error or loading state handling
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000]">
        <div className="text-yellow-500 font-semibold text-xl">{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Admin Panel Title Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${
              titleVisible ? "opacity-100 transform scale-100 blur-0" : "opacity-0 transform scale-150 blur-sm"
            }`}
          >
            Admin Panel
          </h1>
          <p className="text-2xl text-gray-300 mb-12">Manage users and other settings</p>
        </div>
      </section>

      {/* Admin Content Section */}
      <div
        className={`max-w-7xl mx-auto px-4 py-12 transition-all duration-1000 ease-out ${
          contentVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Users Section */}
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Users</h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-black bg-opacity-50 p-6 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700]/60 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-[#FFD700]">{user.username}</h3>
                      <button
                        onClick={() => navigate(`/admin/user/${user.id}`)}
                        className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:scale-105 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                    <p className="text-gray-300 text-lg">{user.email}</p>
                    <p className="text-gray-300 text-sm">Role: {user.role}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#FFD700] text-lg">No users available</p>
                  <p className="text-gray-300 mt-2">There are currently no users in the system</p>
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

      {/* Footer */}
      <footer className="mt-auto bg-black bg-opacity-90 text-gray-400 py-4 text-center">
        <p>2025 All Rights Reserved. HALF BAD</p>
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

export default AdminPanel;
