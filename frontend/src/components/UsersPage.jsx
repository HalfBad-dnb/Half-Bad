import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    address: "",
    phone: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8081/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/admin/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers([...users, response.data]);
      setSuccess("User added successfully!");
      setNewUser({
        username: "",
        email: "",
        password: "",
        fullName: "",
        address: "",
        phone: "",
      });
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user.id !== userId));
      setSuccess("User deleted successfully!");
    } catch (err) {
      setError("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBack = () => {
    navigate("/AdminPanel");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <button
        onClick={handleBack}
        className="mb-6 px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFC500] transition-colors flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Admin Panel
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#FFD700]">Users Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFC500] transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New User
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {showAddForm && (
        <div className="bg-black bg-opacity-80 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="p-2 rounded bg-gray-800 border border-gray-700"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors md:col-span-2"
            >
              Add User
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-black bg-opacity-80 p-6 rounded-xl flex justify-between items-center border border-gray-800 hover:border-[#FFD700] transition-all duration-300"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#FFD700]">{user.username}</h3>
                <p className="text-gray-400">Full Name: {user.fullName}</p>
                <p className="text-gray-400">Email: {user.email}</p>
                <p className="text-gray-400">Address: {user.address || "N/A"}</p>
                <p className="text-gray-400">Phone: {user.phone || "N/A"}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;
