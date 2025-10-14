import React from "react";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">AgroMarketplus</h2>
        <ul className="menu">
          <li>🏠 Home</li>
          <li>💬 Messaging</li>
          <li>📊 Activity</li>
          <li>📰 News</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="main">
        {/* Top Navbar */}
        <header className="navbar">
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="weather">☀️ 25°C</div>
        </header>

        {/* Content Section */}
        <section className="content">
          <h1>Welcome to SmartMarket Dashboard</h1>
          <p>Select a section from the sidebar to get started.</p>
        </section>
      </div>

      {/* Chatbot Button */}
      <button className="chatbot-btn">🤖 Chat</button>
    </div>
  );
}

export default Dashboard;
