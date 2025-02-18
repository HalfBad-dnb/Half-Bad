import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from "react-router-dom";
import { useCart, CartProvider } from "./Context/CartContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faShoppingBasket, faCartPlus, faUser, faSignOutAlt, faCalendarAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';
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
import AdminPanel from "./components/AdminPanel";
import MusicPage from "./components/MusicPage";
import EventsPage from "./components/EventsPage";
import UsersPage from "./components/UsersPage"; 

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
  const [userRole, setUserRole] = useState(null);
  const { cart } = useCart();
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

  const cartCount = useMemo(() => {
    if (userRole === "ADMIN") return 0;
    return cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }, [cart, userRole]);

  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus("Please enter your email address");
      return;
    }
    try {
      const response = await fetch("http://localhost:8081/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus("Success! Thank you for subscribing!");
        setEmail("");
      } else {
        const data = await response.json();
        setSubscriptionStatus(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionStatus("Failed to subscribe. Please try again later.");
    }
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
                {!isAuthenticated || userRole !== "ADMIN" ? (
                  <NavLink to="/cart" className="text-white hover:text-[#FFD700] transition duration-300">
                    <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                    Cart ({cartCount})
                  </NavLink>
                ) : null}
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
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/AdminPanel" : "/profile"} /> : <RegistrationPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to={userRole === "ADMIN" ? "/AdminPanel" : "/profile"} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} />
            <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />} />
            <Route path="/order-confirmation" element={isAuthenticated ? <OrderConfirmationPage /> : <Navigate to="/login" />} />
            <Route path="/AdminPanel" element={isAuthenticated && userRole === "ADMIN" ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="/admin/users" element={isAuthenticated && userRole === "ADMIN" ? <UsersPage /> : <Navigate to="/login" />} />


          </Routes>
        </main>

        {/* Subscription Section */}
{!isAuthenticated && (
  <>
    <h2 className="text-3xl font-bold text-[#FFD700] text-center mt-16">Stay in Touch</h2>
    <p className="text-white mt-4 mb-6 text-center">
      Subscribe to our newsletter to get updates about new merch, music, and events!
    </p>
    <form onSubmit={handleSubscription} className="text-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-72 p-2 rounded-md text-black"
      />
      <button type="submit" className="bg-[#FFD700] text-black py-2 px-6 rounded-md ml-2">
        Subscribe
      </button>
    </form>
    {subscriptionStatus && <p className="mt-4 text-white text-center">{subscriptionStatus}</p>}
  </>
)}

        <footer className="bg-black text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center space-x-6">
              <a href="mailto:your-email@example.com" className="text-white hover:text-[#FFD700]">Email</a>
              <a href="https://www.facebook.com/your-facebook-page" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700]">Facebook</a>
              <a href="https://www.instagram.com/your-instagram-profile" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700]">Instagram</a>
            </div>
            <p className="mt-4 text-white text-sm">© 2025 HALF BAD™</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
