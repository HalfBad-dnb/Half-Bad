import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faUser, faSignOutAlt, faCalendarAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';
import HomePage from "./components/HomePage";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import AdminPanel from "./components/AdminPanel";
import MusicPage from "./components/MusicPage";
import EventsPage from "./components/EventsPage";
import UsersPage from "./components/UsersPage";
import AdminOrders from "./components/AdminOrders";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong!</h2>
        <p>{error?.message}</p>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const fetchAdminData = async () => {
    if (userRole !== "ADMIN") return;

    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("Admin data fetched:", data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRole]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000]">
        <header className="fixed top-0 left-0 w-full bg-black shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8 text-sm">
                <NavLink to="/" className="flex items-center space-x-2">
                  <img src="/images/l1.png" alt="Logo" className="h-16" />
                </NavLink>
                <NavLink to="/" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </NavLink>
                <NavLink to="/music" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faMusic} className="mr-2" />
                  Music
                </NavLink>
                <NavLink to="/events" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Events
                </NavLink>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                {!isAuthenticated ? (
                  <>
                    <NavLink to="/login" className="text-white hover:text-[#FFD700] transition duration-300">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Login
                    </NavLink>
                    <NavLink to="/register" className="text-white hover:text-[#FFD700] transition duration-300">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Register
                    </NavLink>
                  </>
                ) : (
                  <>
                    {userRole === "ADMIN" ? (
                      <NavLink to="/AdminPanel" className="text-white hover:text-[#FFD700] transition duration-300">
                        <FontAwesomeIcon icon={faUserShield} className="mr-2" /> Admin Panel
                      </NavLink>
                    ) : (
                      <NavLink to="/profile" className="text-white hover:text-[#FFD700] transition duration-300">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Profile
                      </NavLink>
                    )}
                    <button onClick={handleLogout} className="text-[#FFD700] hover:text-[#FFCC00] transition duration-300">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>

        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/AdminPanel" : "/profile"} /> : <RegistrationPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/AdminPanel" : "/profile"} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
            <Route path="/AdminPanel" element={isAuthenticated && userRole === "ADMIN" ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="/admin/users" element={isAuthenticated && userRole === "ADMIN" ? <UsersPage /> : <Navigate to="/login" />} />
            <Route path="/admin/orders" element={isAuthenticated && userRole === "ADMIN" ? <AdminOrders /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
