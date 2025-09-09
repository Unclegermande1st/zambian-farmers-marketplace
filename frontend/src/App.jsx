// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import VerifyOTP from "./pages/VerifyOTP";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProductForm from "./pages/AddProductForm";


// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* ✅ Navbar appears on all pages */}
        <Navbar />

        <main className="min-vh-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Buyer Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />

            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} /> {/* ✅ Add this */}
            <Route path="/add-product" element={<AddProductForm />} />
            {/* Future: Admin routes */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;