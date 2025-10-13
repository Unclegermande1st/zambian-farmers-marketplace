import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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

// Multi-role and AI pages
import AdminDashboard from './pages/AdminDashboard';
import AssistantChat from './pages/AssistantChat';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Buyer Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } 
          />

          {/* Communication */}
          <Route 
            path="/chats" 
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            } 
          />

          {/* Resources */}
          <Route path="/articles" element={<Articles />} />

          {/* Dashboards */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer-dashboard" 
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* AI Assistant */}
          <Route 
            path="/assistant" 
            element={
              <ProtectedRoute>
                <AssistantChat />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;