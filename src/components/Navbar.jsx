import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold">
            🌾 SmartAgri
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/home" className="hover:text-green-200">
              Home
            </Link>
            <Link to="/marketplace" className="hover:text-green-200">
              Marketplace
            </Link>
            
            {user?.role === 'farmer' && (
              <Link to="/farmer-dashboard" className="hover:text-green-200">
                My Products
              </Link>
            )}

            <Link to="/assistant" className="hover:text-green-200">
              🤖 AI Assistant
            </Link>

            <Link to="/chats" className="hover:text-green-200">
              💬 Messages
            </Link>

            {user?.role === 'buyer' && (
              <Link to="/cart" className="relative hover:text-green-200">
                🛒 Cart
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-green-200">
                Admin Panel
              </Link>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-4 border-l pl-6">
              <span className="text-sm">
                👤 {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;