// src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import '../styles/global.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState({});
  const { user } = useAuth();
  const { addToCart, cart, getCartCount } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time stock check and add to cart
  const validateAndAddToCart = async (product, quantity = 1) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      const productCheck = await productAPI.getById(product.id);
      if (!productCheck.data) {
        toast.error('This product is no longer available');
        fetchProducts();
        return;
      }

      const availableStock = productCheck.data.quantity;
      const cartItem = cart.find(item => item.id === product.id);
      const currentCartQuantity = cartItem ? cartItem.quantity : 0;
      const totalRequested = currentCartQuantity + quantity;

      if (availableStock === 0) {
        toast.error('This product is out of stock');
        return;
      }

      if (totalRequested > availableStock) {
        const remainingQuantity = availableStock - currentCartQuantity;
        if (remainingQuantity > 0) {
          addToCart(product, remainingQuantity);
          toast.info(`Added ${remainingQuantity}kg to cart (maximum available)`);
        }
        toast.warning(`Only ${availableStock}kg available. You already have ${currentCartQuantity}kg in cart.`);
        return;
      }

      addToCart(product, quantity);
      toast.success(`Added ${product.title} to cart`);
    } catch (err) {
      toast.error('Failed to add item to cart. Please try again.');
      console.error(err);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const getCartQuantityForProduct = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="center">
          <div className="success-icon" style={{ width: 64, height: 64, marginBottom: 16 }}></div>
          <p className="heading-lg muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container-xl">
        {/* Header with Cart */}
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 className="heading-xl">Marketplace</h1>
          <button onClick={() => navigate('/cart')} className="btn-solid" style={{ position: 'relative' }}>
            <span>🛒 Cart</span>
            {getCartCount() > 0 && (
              <span className="pill" style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff' }}>{getCartCount()}</span>
            )}
          </button>
        </div>

        {/* Search & Filter */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="card center" style={{ padding: '40px 16px' }}>
            <div className="muted" style={{ fontSize: 56, marginBottom: 12 }}>🧺</div>
            <h3 className="heading-lg" style={{ marginBottom: 8 }}>No products found</h3>
            <p className="muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filteredProducts.map(product => {
              const cartQty = getCartQuantityForProduct(product.id);
              const isOutOfStock = product.quantity === 0;
              const isLowStock = product.quantity > 0 && product.quantity <= 5;

              return (
                <div key={product.id} className="mk-card">
                  {isOutOfStock && (<div className="badge badge-red">OUT OF STOCK</div>)}
                  {isLowStock && !isOutOfStock && (<div className="badge badge-orange">LOW STOCK</div>)}

                  <div className="mk-media" style={isOutOfStock ? { opacity: .6 } : undefined}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} />
                    ) : (
                      <span className="muted">No Image</span>
                    )}
                  </div>

                  <div className="mk-body">
                    <h3 className="mk-title">{product.title}</h3>
                    <p className="mk-sub">{product.category}</p>
                    <p className="mk-desc">{product.description || 'No description'}</p>
                    <div className="mk-row">
                      <span className="mk-price">${product.price}/kg</span>
                      <span className="mk-stock">{product.quantity}kg available</span>
                    </div>

                    {cartQty > 0 && (
                      <div className="notice">🛒 {cartQty}kg in cart</div>
                    )}

                    <button
                      onClick={() => validateAndAddToCart(product, 1)}
                      disabled={isOutOfStock || addingToCart[product.id]}
                      className="btn-solid" style={{ width: '100%', opacity: isOutOfStock ? .6 : 1 }}
                    >
                      {addingToCart[product.id] ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
