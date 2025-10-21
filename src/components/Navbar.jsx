import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./nav.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          Agro<span>Market+</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/assistant">Assistant</Link>
          <Link to="/chats">Chats</Link>
          {user?.role === "farmer" && <Link to="/farmer-dashboard">Farmer</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          <Link to="/orders">Orders</Link>

          {/* Cart */}
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cart-count"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* Auth Links */}
          {user ? (
            <div className="user-dropdown">
              <button onClick={toggleDropdown} className="user-btn">
                <User size={18} />
                <span>{user.name}</span>
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="dropdown-menu"
                >
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button onClick={logout}>Logout</button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mobile-menu"
        >
          <Link to="/home" onClick={toggleMenu}>Home</Link>
          <Link to="/marketplace" onClick={toggleMenu}>Marketplace</Link>
          <Link to="/articles" onClick={toggleMenu}>Articles</Link>
          <Link to="/assistant" onClick={toggleMenu}>Assistant</Link>
          <Link to="/chats" onClick={toggleMenu}>Chats</Link>
          {user && <Link to="/profile" onClick={toggleMenu}>Profile</Link>}
          <Link to="/cart" onClick={toggleMenu}>
            <ShoppingCart size={18} /> Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <button
                onClick={() => {
                  toggleMenu();
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/register" onClick={toggleMenu} className="register-btn">
                Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
