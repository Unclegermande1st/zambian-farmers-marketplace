// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      backgroundColor: "#fff"
    }}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "6px"
        }} />
      ) : (
        <div style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          color: "#999"
        }}>
          No Image
        </div>
      )}

      <h3 style={{ margin: "12px 0", fontSize: "1.2rem" }}>{product.title}</h3>
      <p><strong>K{product.price}</strong> per unit</p>
      <p>{product.quantity} units available</p>
      <p><em>{product.category}</em></p>
      <p>{product.description}</p>

      <Link to={`/product/${product.id}`}>
        <button style={{
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          View Details
        </button>
      </Link>
    </div>
  );
}