// frontend/src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2>{product.title}</h2>
      <p><strong>Price:</strong> K{product.price}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p>{product.description}</p>
      <button className="btn btn-primary">Add to Cart</button>
    </div>
  );
}