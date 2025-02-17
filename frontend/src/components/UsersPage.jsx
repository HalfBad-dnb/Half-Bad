import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8081/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (userId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter(user => user.id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <h1 className="text-5xl font-bold text-[#FFD700] text-center mb-12">All Users</h1>

      {/* Button to add new user */}
      <div className="text-center mb-6">
        <button
          onClick={() => navigate("/admin/users/add")}
          className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg"
        >
          Add New User
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="bg-black bg-opacity-50 p-4 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700]/60 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#FFD700]">{user.username}</h3>
              <button
                onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:scale-105 transition-all duration-300"
              >
                Update User
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:scale-105 transition-all duration-300"
              >
                Delete User
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300">No users available</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
