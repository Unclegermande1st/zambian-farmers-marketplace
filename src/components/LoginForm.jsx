// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await authAPI.login(email, password);
      
      // Use auth context to save user data
      login(res.data);

      setMessage('Login successful!');

      // Redirect based on role
      setTimeout(() => {
        switch (res.data.role) {
          case 'farmer':
            navigate('/farmer-dashboard');
            break;
          case 'buyer':
            navigate('/home');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/home');
        }
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        {message && (
          <p
            style={{
              marginTop: '10px',
              color: message.includes('failed') ? 'red' : 'green',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}

        <div className="signup-prompt">
          Not a member?{' '}
          <a href="/register">
            Signup now
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;