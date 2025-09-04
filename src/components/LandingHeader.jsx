import './LandingHeader.css';
import { Link } from 'react-router-dom'; // ✅ Add this import

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo">Logo</div>
      <nav>
        <ul>
         {/* removed the signup and login button */}
         {/* <li><Link to="/login">Login</Link></li> */}
          <li><Link to="/service">Service</Link></li>
          <li><Link to="/learn">Learn</Link></li>
          <li><Link to="/contact">Contact</Link></li>
         {/* <li><Link to="/register" className="signup-btn">Sign Up</Link></li> {/* ✅ Updated */}
        </ul>
      </nav>
    </header>
  );
}

export default LandingHeader;
