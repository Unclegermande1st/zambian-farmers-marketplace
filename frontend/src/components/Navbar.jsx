// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role") || null;
  const name = localStorage.getItem("name") || "User";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          🌾 Zambian Farmers Market
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
                <span className="text-white me-3">
                  Hello, <strong>{name}</strong>
                </span>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/"; // Back to landing
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
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