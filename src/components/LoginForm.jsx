// src/components/LoginForm.jsx
import React, { useState } from 'react';
import '../styles/LoginForm.css'; // We'll create this CSS file

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Login</h2>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email or Phone</label>
          <input 
            type="text" 
            id="email" 
            placeholder="Enter your email or phone number" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        
        <button type="submit" className="login-button">LOGIN</button>
        
        <div className="signup-prompt">
          Not a member? <a href="#" onClick={onSwitchToSignup}>Signup now</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;