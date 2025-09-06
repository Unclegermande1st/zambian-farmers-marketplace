// frontend/src/pages/FarmerDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load your products:", err);
        alert("Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [token]);

  return (
    <div className="container my-4">
      <h2 className="mb-4"> My Products</h2>
      <a href="/product/new" className="btn btn-success mb-4">+ Add New Product</a>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>You haven't listed any products yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}