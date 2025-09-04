import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Landing() {
  return (
    <section className="landing">
      <div className="hero-content">
        <h1>Welcome to Our Service</h1>
        <h2>Your journey begins here</h2>
        <p>
          Explore the features and benefits of our platform. Join us and
          experience seamless integration.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="btn signup-btn">
            Sign Up
          </Link>
          <Link to="/login" className="btn login-btn">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Landing;
