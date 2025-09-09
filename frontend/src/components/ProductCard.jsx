// frontend/src/components/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="card h-100">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
        />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center"
          style={{ height: "180px", backgroundColor: "#f8f9fa", color: "#6c757d" }}
        >
          No Image
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text text-success">
          <strong>K{product.price}</strong> per unit
        </p>
        <p className="card-text">
          <small>{product.quantity} units available</small>
          <br />
          <em>{product.category}</em>
        </p>
        <p className="card-text" style={{ fontSize: "0.9rem" }}>
          {product.description}
        </p>

        <div className="mt-auto d-grid gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View Details
          </button>

          <button
            className="btn btn-sm btn-success"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}