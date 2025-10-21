import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import "../styles/newHome.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert('Added to cart!');
  };

  const handleMessageSeller = (farmerId) => {
    navigate('/chats', { state: { sellerId: farmerId } });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading fresh produce...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Unable to Load Products</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchProducts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>
          Fresh Farm <span>Produce</span>
        </h1>
        <p>
          Direct from local farmers to your table. Experience the freshest, most
          authentic produce Zambia has to offer.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/cart')}>
            View Cart
          </button>
          <button className="btn-outline" onClick={() => navigate('/marketplace')}>
            Browse All Products
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="featured-header">
          <div>
            <h2>Fresh Farm Produce</h2>
            <p>Handpicked produce from trusted farmers</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/marketplace')}>
            View All
          </button>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No products available yet</h3>
            <p>Check back soon for fresh produce from local farmers!</p>
            <button className="btn-primary" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className="product-placeholder">No Image</div>
                )}
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.description || 'No description available'}</p>
                  <div className="product-price">K{product.price}</div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                      className="add-cart-btn"
                    >
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => handleMessageSeller(product.farmerId)}
                      className="message-btn"
                    >
                      Message Seller
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Active Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {new Set(products.map((p) => p.farmerId)).size}
          </div>
          <div className="stat-label">Local Farmers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {products.reduce((sum, p) => sum + p.quantity, 0)}
          </div>
          <div className="stat-label">Total Stock (kg)</div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h3>Why Shop with AgroMarket+</h3>
          <ul>
            <li>Verified farmers for trust</li>
            <li>Transparent stock and pricing</li>
            <li>Secure payments and communication</li>
          </ul>
        </div>

        <div className="assistant-card">
          <h3>Need Help?</h3>
          <p>
            Ask the SmartAgri Assistant for planting tips and product guidance.
          </p>
          <button
            className="assistant-btn"
            onClick={() => navigate('/assistant')}
          >
            Chat with Assistant
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
