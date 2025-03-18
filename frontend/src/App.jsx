import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHome, faMusic, faUser, faSignOutAlt, faCalendarAlt, faUserShield, faAngleDown } from "@fortawesome/free-solid-svg-icons";
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
import ArtistMenu from "./components/ArtistMenu";
import Eddiek from "./artists/Eddiek";
import Halfbad from "./artists/Halfbad";


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false); // New state for artists dropdown

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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-black shadow-lg z-50 flex justify-between items-center px-6 py-4">
        <FontAwesomeIcon 
          icon={faBars} 
          className="text-white text-2xl cursor-pointer" 
          onClick={() => setMenuOpen(true)} 
        />
      </header>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex">
          <div className="w-64 bg-gray-900 h-full p-5 flex flex-col">
            <button className="text-white text-2xl self-end mb-4" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <NavLink to="/" className="text-white py-2" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
            </NavLink>
            <NavLink to="/music" className="text-white py-2" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faMusic} className="mr-2" /> Music
            </NavLink>
            {/* Artists Menu with Dropdown */}
            <div>
              <button 
                className="text-white py-2 w-full text-left flex items-center justify-between"
                onClick={() => setArtistsOpen(!artistsOpen)}
              >
                <span>
                  <FontAwesomeIcon icon={faMusic} className="mr-2" /> Artists
                </span>
                <FontAwesomeIcon icon={faAngleDown} className={`transform ${artistsOpen ? 'rotate-180' : ''}`} />
              </button>
              {artistsOpen && (
                <div className="pl-6">
                  <NavLink 
                    to="/eddiek" 
                    className="text-white py-2 block" 
                    onClick={() => {
                      setMenuOpen(false);
                      setArtistsOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faMusic} className="mr-2" /> Eddiek
                  </NavLink>
                  <NavLink 
                    to="/halfbad" 
                    className="text-white py-2 block" 
                    onClick={() => {
                      setMenuOpen(false);
                      setArtistsOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faMusic} className="mr-2" /> Halfbad
                  </NavLink>
                </div>
              )}
            </div>
            <NavLink to="/events" className="text-white py-2" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Events
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="text-white py-2" onClick={() => setMenuOpen(false)}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Login
                </NavLink>
                <NavLink to="/register" className="text-white py-2" onClick={() => setMenuOpen(false)}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Register
                </NavLink>
              </>
            ) : (
              <>
                {userRole === "ADMIN" ? (
                  <NavLink to="/admin-panel" className="text-white py-2" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUserShield} className="mr-2" /> Admin Panel
                  </NavLink>
                ) : (
                  <NavLink to="/profile" className="text-white py-2" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                  </NavLink>
                )}
                <button onClick={handleLogout} className="text-red-500 py-2 mt-4">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/artist-menu" element={<ArtistMenu />} />
         
          <Route path="/eddiek" element={<Eddiek />} />
          <Route path="/halfbad" element={<Halfbad />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/admin-panel" : "/profile"} /> : <RegistrationPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/admin-panel" : "/profile"} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
          <Route path="/admin-panel" element={isAuthenticated && userRole === "ADMIN" ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={isAuthenticated && userRole === "ADMIN" ? <UsersPage /> : <Navigate to="/login" />} />
          <Route path="/admin/orders" element={isAuthenticated && userRole === "ADMIN" ? <AdminOrders /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4 fixed bottom-0 w-full">
        <p>HALF BAD © {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;