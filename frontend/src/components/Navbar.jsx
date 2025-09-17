// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { loadCart } from "../utils/cartUtils"; // Import cart utility

export default function Navbar() {
  const role = localStorage.getItem("role") || null;
  const name = localStorage.getItem("name") || "User";

  // Get cart size
  const cart = loadCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
           Zambian Farmers Market🌾
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/marketplace">
                Marketplace
              </Link>
            </li>
            {role === "farmer" && (
              <li className="nav-item">
                <Link className="nav-link" to="/farmer/dashboard">
                  My Products
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {role ? (
              <>
                {/* Cart Button */}
                <Link to="/cart" className="btn btn-outline-light btn-sm me-3 position-relative">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Inbox Button - Only show if user is logged in */}
                <Link to="/inbox" className="btn btn-outline-light btn-sm me-3 position-relative">
                   Inbox
                  {/* Optional: Add unread count badge later */}
                  {/* {hasUnread && <span className="position-absolute top-0 start-100 translate-middle badge bg-warning">!</span>} */}
                </Link>

                {/* Greeting & Logout */}
                <span className="text-white me-3">
                  Hello, <strong>{name}</strong>
                </span>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              /* Login/Register Buttons for Guests */
              <div className="d-grid gap-2 d-md-flex">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}