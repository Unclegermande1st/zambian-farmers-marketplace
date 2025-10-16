import React, { useState } from "react";

function Dashboard() {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "marketplace", icon: "🛒", label: "Marketplace" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "activity", icon: "📊", label: "Activity" },
    { id: "news", icon: "📰", label: "News" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col shadow-xl rounded-r-3xl">
        {/* Logo */}
        <div className="p-6 border-b border-green-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            🌾
          </div>
          <h2 className="text-xl font-bold">AgroMarket+</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                active === item.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-700/50"
                  : "hover:bg-green-700/30 text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Help Card */}
        <div className="m-4 bg-green-700/40 p-4 rounded-xl text-center">
          <h4 className="font-semibold mb-1">Need Help?</h4>
          <p className="text-xs text-gray-200 mb-3">
            Visit our support center
          </p>
          <button className="bg-white text-green-800 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Get Support
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Weather & Notifications */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <span className="text-xl">☀️</span>
              <div>
                <p className="text-sm font-semibold text-gray-700">25°C</p>
                <p className="text-xs text-gray-500">Sunny</p>
              </div>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-xl">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Section */}
        <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white rounded-3xl p-8 shadow-lg mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to AgroMarket+ Dashboard
          </h1>
          <p className="text-sm text-green-100">
            Explore smart farming insights, track your activity, and stay up to date with the latest agricultural trends.
          </p>
        </section>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <h3 className="font-semibold text-gray-800 mb-2">🌱 Crop Insights</h3>
            <p className="text-gray-600 text-sm">
              Get personalized tips and weather forecasts for your crops.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <h3 className="font-semibold text-gray-800 mb-2">📦 Marketplace</h3>
            <p className="text-gray-600 text-sm">
              Buy and sell agricultural products with verified farmers and buyers.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <h3 className="font-semibold text-gray-800 mb-2">📈 Analytics</h3>
            <p className="text-gray-600 text-sm">
              Track your sales, messages, and platform engagement in real time.
            </p>
          </div>
        </div>

        {/* Chatbot Button */}
        <button className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110">
          🤖
        </button>
      </main>
    </div>
  );
}

export default Dashboard;
