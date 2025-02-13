import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "", profilePicture: "" });
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch User Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");

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
          setUser(response.data);
          setFormData({ ...response.data }); // Set form data from user info
        }
      } catch (err) {
        console.error("Error fetching user info:", err.response?.data || err.message);
        setError("Failed to fetch user info: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Fade In Effect for Edit Section
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 500);
    setTimeout(() => setContentVisible(true), 1000);
  }, []);

  // Handle Form Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found in session storage");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://localhost:8081/api/user/edit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        navigate("/profile"); // Redirect to profile page after edit
      }
    } catch (err) {
      console.error("Error updating user info:", err.response?.data || err.message);
      setError("Failed to update user info: " + (err.response?.data?.message || err.message));
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
      {/* Edit Title Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${
              titleVisible ? "opacity-100 transform scale-100 blur-0" : "opacity-0 transform scale-150 blur-sm"
            }`}
          >
            Edit Profile
          </h1>
          <p className="text-2xl text-gray-300 mb-12">Modify your profile information</p>
        </div>
      </section>

      {/* Edit Content Section */}
      <div
        className={`max-w-7xl mx-auto px-4 py-12 transition-all duration-1000 ease-out ${
          contentVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Edit Profile Card */}
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
            </div>
          </div>

          {/* Edit Form Section */}
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Edit Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-300 text-lg" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-black bg-opacity-70 text-white border-2 border-[#FFD700] rounded-lg mt-2"
                />
              </div>

              <div>
                <label className="text-gray-300 text-lg" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-black bg-opacity-70 text-white border-2 border-[#FFD700] rounded-lg mt-2"
                />
              </div>

              <div>
                <label className="text-gray-300 text-lg" htmlFor="profilePicture">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-black bg-opacity-70 text-white border-2 border-[#FFD700] rounded-lg mt-2"
                />
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FFD700] text-black font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-black bg-opacity-90 text-gray-400 py-4 text-center">
        <p>© 2025 All Rights Reserved. HALF BAD™</p>
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

export default EditProfilePage;
