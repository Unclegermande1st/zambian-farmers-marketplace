import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const { addToCart, cart, getCartCount } = useCart();
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
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show success feedback
    alert(`Added ${product.title} to cart!`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
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
            onClick={() => navigate('/checkout')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            🛒 Cart ({getCartCount()})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {product.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-green-600 font-bold text-xl">
                      ${product.price}/kg
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.quantity}kg available
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;