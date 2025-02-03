import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
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
                <small className="text-gray-400 mt-1 block">Choose a unique username</small>
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
                <small className="text-gray-400 mt-1 block">We'll never share your email</small>
              </div>

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
                <small className="text-gray-400 mt-1 block">Minimum 8 characters</small>
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
                <small className="text-gray-400 mt-1 block">Re-enter your password</small>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD700] text-black font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                Create Account
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#FFD700] hover:text-[#FFD700]/80 transition-colors duration-300"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
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

export default RegistrationPage;
