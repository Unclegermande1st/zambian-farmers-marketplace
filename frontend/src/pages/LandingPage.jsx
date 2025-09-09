// frontend/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-light" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Hero Section */}
      <header className="bg-success text-white text-center py-5 shadow-sm">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">🌽 Zambian Farmers Market</h1>
          <p className="lead mb-4">
            Connect directly with farmers and buyers — fair prices, no middlemen.
          </p>
          <div>
            <Link
              to="/register"
              className="btn btn-light btn-lg px-4 me-3 rounded-pill shadow-sm"
            >
              Join as Farmer
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-light btn-lg px-4 rounded-pill"
            >
              Buy Fresh Produce
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <h3 className="mb-3">👨‍🌾 For Farmers</h3>
                <p className="text-muted">
                  List your produce, reach buyers directly, and get fair prices.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <h3 className="mb-3">🛒 For Buyers</h3>
                <p className="text-muted">
                  Buy fresh, traceable farm produce with transparent pricing.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <h3 className="mb-3">🔒 Secure & Verified</h3>
                <p className="text-muted">
                  OTP login, identity verification, and transaction traceability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="mb-4">
            Join hundreds of Zambian farmers and buyers today.
          </p>
          <Link
            to="/register"
            className="btn btn-light btn-lg me-3 rounded-pill shadow-sm"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="btn btn-outline-light btn-lg rounded-pill"
          >
            I Already Have an Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <p className="mb-0 small">
          &copy; {new Date().getFullYear()} <strong>Zambian Farmers Market</strong>.{" "}
          Empowering Rural Agriculture.
        </p>
      </footer>
    </div>
  );
}
