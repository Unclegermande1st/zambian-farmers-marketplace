import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// my page imports
import Landing from './pages/Landing';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Articles from './pages/Articles';
import Register from './pages/Registering'; 
import LoginForm from './components/LoginForm';
import Dashboard from './pages/dashboard'; // ✅ import dashboard


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ new route */}

      </Routes>
    </Router>
  )
}

export default App;
