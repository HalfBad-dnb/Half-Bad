import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetailPage"; 
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import PaymentPage from "./components/PaymentPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import AdminPanel from "./components/AdminPanel"; // New Admin Panel component
import MusicPage from "./components/MusicPage";
import EventsPage from "./components/EventsPage";
import { useCart, CartProvider } from "./Context/CartContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faShoppingBasket, faCartPlus, faUser, faSignOutAlt, faCalendarAlt, faUserShield } from '@fortawesome/free-solid-svg-icons'; // Imported faUserShield

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
    <CartProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </CartProvider>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Initialize user role state
  const { cart } = useCart();

  useEffect(() => {
    // Check if the user is authenticated and retrieve role from sessionStorage
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role"); // Retrieve role from sessionStorage

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role); // Set role if user is authenticated
    } else {
      setIsAuthenticated(false);
      setUserRole(null); // Reset role if not authenticated
    }
  }, []); // Empty array ensures this effect runs only on initial load

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");  // Remove role from session storage
    setIsAuthenticated(false);
    setUserRole(null); // Reset role when logging out
  };

  // Use memoization for cart count to optimize re-renders
  const cartCount = useMemo(() => cart?.reduce((acc, item) => acc + item.quantity, 0) || 0, [cart]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000]">
        <header className="fixed top-0 left-0 w-full bg-black shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8 text-sm">
                <NavLink to="/" className="flex items-center space-x-2">
                  <img src="/images/l1.png" alt="My Logo" className="h-16" />
                </NavLink>
                <NavLink to="/" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </NavLink>
                <NavLink to="/products" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faShoppingBasket} className="mr-2" />
                  Merch
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
                <NavLink to="/cart" className="text-white hover:text-[#FFD700] transition duration-300">
                  <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                  Cart ({cartCount})
                </NavLink>
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
                    {/* Show Admin Panel if role is admin */}
                    {userRole === "ADMIN" ? (
                      <NavLink to="/admin" className="text-white hover:text-[#FFD700] transition duration-300">
                        <FontAwesomeIcon icon={faUserShield} className="mr-2" /> {/* Admin Icon */}
                        Admin Panel
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
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Authentication Routes */}
            <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegistrationPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />

            {/* Protected Routes */}
            <Route path="/profile" element={isAuthenticated && userRole !== "ADMIN" ? <ProfilePage /> : <Navigate to={userRole === "ADMIN" ? "/admin" : "/login"} />} />
            <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} />
            <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />} />
            <Route path="/order-confirmation" element={isAuthenticated ? <OrderConfirmationPage /> : <Navigate to="/login" />} />

            {/* Admin Panel Route */}
            <Route path="/admin" element={isAuthenticated && userRole === "ADMIN" ? <AdminPanel /> : <Navigate to={isAuthenticated ? "/profile" : "/login"} />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
