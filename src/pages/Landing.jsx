import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import farmBackground from '../assets/farm-background.jpg';


function Landing() {
  return (
    <>
      {/* Modern Navbar */}
      <nav className="landing-navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="logo-text">AgroMarket</span>
            <span className="logo-plus">+</span>
          </div>
        <ul className="nav-links">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li><Link to="/login" className="nav-btn login-btn">Login</Link></li>
            <li><Link to="/register" className="nav-btn signup-btn">Sign Up</Link></li>
        </ul>
        </div>
      </nav>

     {/* Hero Section */}
<section
  id="home"
  className="hero-section"
  style={{
    backgroundImage: `url(${farmBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  }}
>
  <div className="hero-background">
    <div className="hero-overlay"></div>
  </div>
  
  <div className="hero-content">
    <div className="hero-text">
      <h1 className="hero-title">
        Welcome to <span className="highlight">AgroMarket+</span>
      </h1>
      <h2 className="hero-subtitle">
        Bringing fresh farm produce closer to you
      </h2>
      <p className="hero-description">
        Connect directly with local farmers and enjoy fresh, organic produce delivered to your doorstep. 
        Experience seamless transactions and support sustainable agriculture in Zambia.
      </p>
      
      <div className="hero-buttons">
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Sign In
        </Link>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Farmers</span>
        </div>
        <div className="stat">
          <span className="stat-number">1000+</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>
    </div>
  </div>
  
  <div className="scroll-indicator">
    <div className="scroll-arrow">↓</div>
    <span>Scroll to explore</span>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AgroMarket+?</h2>
            <p>Empowering farmers and connecting communities through technology</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3>Fresh Produce</h3>
              <p>Direct from farm to table, ensuring the freshest and highest quality produce for your family.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>Direct Trade</h3>
              <p>Connect directly with local farmers, cutting out middlemen and ensuring fair prices for everyone.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing with multiple options to suit your preferences.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery service to bring your orders right to your doorstep.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Easy to Use</h3>
              <p>Intuitive mobile and web platform designed for farmers and buyers of all ages.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Local Impact</h3>
              <p>Support local agriculture and contribute to sustainable farming practices in Zambia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About AgroMarket+</h2>
              <p>
                AgroMarket+ is Zambia's premier digital marketplace connecting local farmers with buyers across the country. 
                We believe in empowering agricultural communities through technology, creating sustainable economic opportunities, 
                and ensuring food security for all Zambians.
              </p>
              <p>
                Our platform simplifies the agricultural supply chain, making it easier for farmers to reach customers 
                and for buyers to access fresh, local produce. Join thousands of farmers and buyers who trust AgroMarket+ 
                for their agricultural needs.
              </p>
              
              <div className="about-stats">
                <div className="about-stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Districts Covered</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </div>
            
            <div className="about-image">
              <div className="image-placeholder">
                <div className="community-illustration">
                  <div className="people">
                    <div className="person person-1"></div>
                    <div className="person person-2"></div>
                    <div className="person person-3"></div>
                    <div className="person person-4"></div>
                  </div>
                  <div className="connection-lines"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <p>We're here to help you succeed in your agricultural journey</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>support@agromarket.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+260 97 000 0000</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Address</h4>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
            </div>
            
            <div className="contact-cta">
              <h3>Ready to get started?</h3>
              <p>Join our community of farmers and buyers today!</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">
                  Start as Farmer
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">🌾</span>
                <span className="logo-text">AgroMarket</span>
              </div>
              <p>Connecting farmers and buyers across Zambia</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#about">About</a></li>
                  <li><Link to="/marketplace">Marketplace</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">FAQ</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Account</h4>
                <ul>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Sign Up</Link></li>
                  <li><a href="#">Forgot Password</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 AgroMarket+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;
