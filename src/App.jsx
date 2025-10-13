import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Communication */}
        <Route path="/chats" element={<Chats />} />

        {/* Resources */}
        <Route path="/articles" element={<Articles />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* AI Assistant */}
        <Route path="/assistant" element={<AssistantChat />} />
      </Routes>
    </Router>
  );
}

export default App;
