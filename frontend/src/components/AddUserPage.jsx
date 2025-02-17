import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      await axios.post("http://localhost:8081/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white p-10">
      <h1 className="text-5xl font-bold text-[#FFD700] text-center mb-12">Add New User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xl">
          Username:
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            className="bg-black text-white p-2 rounded"
          />
        </label>
        <label className="block text-xl">
          Email:
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            className="bg-black text-white p-2 rounded"
          />
        </label>
        <label className="block text-xl">
          Password:
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            className="bg-black text-white p-2 rounded"
          />
        </label>
        <button type="submit" className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
