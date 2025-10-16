import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ user, onLogout, cartItems = [] }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cartItems.length;

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
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-green-700 to-emerald-600 shadow-lg"
          : "bg-gradient-to-r from-green-600 to-emerald-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-white text-2xl font-bold tracking-wide hover:text-amber-300 transition-colors"
          >
            Agro<span className="text-amber-300">Market+</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-amber-300 transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-white hover:text-amber-300 transition-all duration-200 font-medium"
            >
              Marketplace
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-amber-300 transition-all duration-200 font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-amber-300 transition-all duration-200 font-medium"
            >
              Contact
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-white hover:text-amber-300 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 text-white hover:text-amber-300 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-amber-300 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-400 text-green-900 font-semibold px-4 py-2 rounded-xl hover:bg-amber-300 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 transition"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col space-y-3 py-3 bg-green-700 rounded-b-2xl shadow-lg"
          >
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 px-4 py-2"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 px-4 py-2"
            >
              Marketplace
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 px-4 py-2"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 px-4 py-2"
            >
              Contact
            </Link>
            <Link
              to="/cart"
              onClick={toggleMenu}
              className="text-white hover:text-amber-300 px-4 py-2 flex items-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <button
                  onClick={() => {
                    toggleMenu();
                    navigate("/profile");
                  }}
                  className="text-white text-left px-4 py-2 hover:text-amber-300"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    toggleMenu();
                    onLogout();
                  }}
                  className="text-white text-left px-4 py-2 hover:text-amber-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="text-white px-4 py-2 hover:text-amber-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="bg-amber-400 text-green-900 font-semibold mx-4 px-4 py-2 rounded-xl hover:bg-amber-300 transition"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
