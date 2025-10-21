// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page imports
import Landing from './pages/Landing';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Articles from './pages/Articles';
import Register from './pages/Registering'; 
import LoginForm from './components/LoginForm';
import Dashboard from './pages/dashboard';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AssistantChat from './pages/AssistantChat';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/articles" element={<Articles />} />
              {/* Fallback for root to go to home if logged in via redirect component could be added later */}

              {/* Protected Routes with Navbar */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Home />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Marketplace />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Checkout />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Cart />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <OrderHistory />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <PaymentSuccess />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Chats />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* Dashboards */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                }
              />
              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Profile />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer-dashboard"
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <>
                      <Navbar />
                      <FarmerDashboard />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <>
                      <Navbar />
                      <AdminDashboard />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* AI Assistant */}
              <Route
                path="/assistant"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <AssistantChat />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
