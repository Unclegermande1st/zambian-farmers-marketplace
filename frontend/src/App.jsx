// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import VerifyOTP from "./pages/VerifyOTP";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* ✅ Navbar appears on all pages */}
        <Navbar />
        
        <main className="min-vh-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;