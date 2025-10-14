// src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

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
        toast.error('❌ This product is out of stock');
        return;
      }

      if (totalRequested > availableStock) {
        const remainingQuantity = availableStock - currentCartQuantity;
        if (remainingQuantity > 0) {
          addToCart(product, remainingQuantity);
          toast.info(`Added ${remainingQuantity}kg to cart (max available)`);
        }
        toast.warning(`⚠️ Only ${availableStock}kg available. You already have ${currentCartQuantity}kg in cart.`);
        return;
      }

      addToCart(product, quantity);
      toast.success(`✅ Added ${product.title} to cart!`);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Cart */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 relative"
          >
            🛒 Cart
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-3 w-full pl-10"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-3 w-full"
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
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const cartQty = getCartQuantityForProduct(product.id);
              const isOutOfStock = product.quantity === 0;
              const isLowStock = product.quantity > 0 && product.quantity <= 5;

              return (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden relative">
                  {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      OUT OF STOCK
                    </div>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      LOW STOCK
                    </div>
                  )}

                  <div className={`h-48 bg-gray-200 flex items-center justify-center ${isOutOfStock ? 'opacity-50' : ''}`}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover"/>
                    ) : (
                      <span className="text-gray-400 text-4xl">📦</span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description || 'No description'}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-600 font-bold text-xl">${product.price}/kg</span>
                      <span className={`text-sm ${isLowStock ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>{product.quantity}kg available</span>
                    </div>

                    {cartQty > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-sm text-blue-700">
                        🛒 {cartQty}kg in cart
                      </div>
                    )}

                    <button
                      onClick={() => validateAndAddToCart(product, 1)}
                      disabled={isOutOfStock || addingToCart[product.id]}
                      className={`w-full py-2 rounded-lg transition font-semibold ${
                        isOutOfStock
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addingToCart[product.id]
                          ? 'bg-gray-400 text-white cursor-wait'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
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
