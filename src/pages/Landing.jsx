import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Landing() {
  return (
    <>
      {/* Transparent Navbar */}
      <nav className="landing-navbar">
        <div className="logo">AgroMarket+</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/login" className="nav-btn">Login</Link></li>
          <li><Link to="/register" className="nav-btn highlight">Sign Up</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="landing">
        <div className="hero-content">
          <h1>Welcome to AgroMarket+</h1>
          <h2>Bringing farm produce closer to you</h2>
          <p>
            Explore trusted suppliers and farmers around you. Enjoy seamless and secure transactions with our digital marketplace.
          </p>

        </div>
        <div className="scroll-down">↓</div>
      </section>

      {/* About Section */}
      <section id="about" className="info-section">
        <h2>About Us</h2>
        <p>
          AgroMarket+ connects farmers and buyers directly simplifying trade, improving transparency, 
          and empowering local agriculture.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="info-section contact-section">
        <h2>Contact Us</h2>
        <p>Email: support@agromarket.com | Phone: +260 97 000 0000</p>
      </section>
    </>
  );
}

export default Landing;
