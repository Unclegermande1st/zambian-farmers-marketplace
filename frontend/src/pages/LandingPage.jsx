// frontend/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-light" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Hero Section */}
      <header className="bg-success text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Zambian Farmers Market</h1>
          <p className="lead">
            Connect directly with farmers and buyers — fair prices, no middlemen.
          </p>
          <div className="mt-4">
            <Link to="/register" className="btn btn-light btn-lg px-4 me-2">
              Join as Farmer
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              Buy Fresh Produce
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>👨‍🌾 For Farmers</h3>
                <p>List your produce, reach buyers directly, and get fair prices.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>🛒 For Buyers</h3>
                <p>Buy fresh, traceable farm produce with transparent pricing.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>🔒 Secure & Verified</h3>
                <p>OTP login, identity verification, and transaction traceability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p className="mb-4">Join hundreds of Zambian farmers and buyers today.</p>
          <Link to="/register" className="btn btn-light btn-lg me-3">
            Create Account
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">
            I Already Have an Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Zambian Farmers Market. 
          Empowering Rural Agriculture.
        </p>
      </footer>
    </div>
  );
}