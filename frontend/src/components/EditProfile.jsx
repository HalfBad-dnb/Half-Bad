import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    // Fetch current user data
    axios
      .get("http://localhost:8081/api/user/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilePicture", profilePictureFile);
    formData.append("address", user.address);

    axios
      .put("http://localhost:8081/api/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        alert("Profile updated successfully!");
        setUser(response.data); // Update state with the new user data
      })
      .catch((error) => {
        console.error("There was an error updating the profile:", error);
        alert("There was an error updating the profile.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] flex items-center justify-center">
      <div className="w-full max-w-3xl px-6 py-12 bg-transparent">
        <h2 className="text-4xl font-bold text-center text-orange-300 mb-8">Edit Profile</h2>

        <div className="bg-transparent p-6 rounded-lg shadow-lg max-w-lg mx-auto border-4 border-yellow-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-100">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-100">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-100">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

          

            <div>
              <label htmlFor="profilePicture" className="block text-gray-100">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-300"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
