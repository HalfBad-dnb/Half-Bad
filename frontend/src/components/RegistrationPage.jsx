import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faLockOpen, faPhone } from '@fortawesome/free-solid-svg-icons';

function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setfirst_name] = useState(""); // Added first name
  const [last_name, setlast_name] = useState(""); // Added last name
  const [address, setAddress] = useState(""); // Added address
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name,
          last_name,
          address,
          phoneNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed!");
        return;
      }

      setSuccess("Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setfirst_name("");
      setlast_name("");
      setAddress("");
      setPhoneNumber("");
      navigate("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
            Register
          </h1>
          <p className="text-2xl text-gray-300 mb-12">Join the Half Bad community</p>
        </div>
      </section>

      {/* Registration Form Section */}
      <div className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-md mx-auto">
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
            {error && (
              <div className="text-red-500 text-sm text-center mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Existing fields */}
              <div>
                <label htmlFor="username" className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* New fields */}
              <div>
                <label htmlFor="first_name" className="block text-[#FFD700] text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setfirst_name(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-[#FFD700] text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setlast_name(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-[#FFD700] text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faLock} className="mr-2" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[#FFD700] text-sm font-medium mb-2">
                  <FontAwesomeIcon icon={faLockOpen} className="mr-2" /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/60 rounded-lg outline-none transition-all duration-300 text-white placeholder-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#ffdd00] transition duration-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
