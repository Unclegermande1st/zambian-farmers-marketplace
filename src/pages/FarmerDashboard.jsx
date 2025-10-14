// src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalEarnings: 0,
    lowStockItems: 0,
    recentOrders: []
  });

  const [formData, setFormData] = useState({
    title: '',
    category: 'Vegetables',
    description: '',
    quantity: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Fetch products
      const productsRes = await productAPI.getMy();
      setProducts(productsRes.data);

      // Fetch orders (for stats)
      const token = localStorage.getItem('token');
      const ordersRes = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orders = ordersRes.data;
      const totalSales = orders.length;
      const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStockItems = productsRes.data.filter(p => p.quantity < 10).length;

      setStats({
        totalProducts: productsRes.data.length,
        totalSales,
        totalEarnings: totalEarnings.toFixed(2),
        lowStockItems,
        recentOrders: orders.slice(0, 5)
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setMessage('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(formData);
        toast.success('Product created successfully!');
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        title: '',
        category: 'Vegetables',
        description: '',
        quantity: '',
        price: '',
        imageUrl: ''
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description || '',
      quantity: product.quantity,
      price: product.price,
      imageUrl: product.imageUrl || ''
    });
    setShowForm(true);
    setActiveTab('products');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name} 🌾</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setActiveTab('products');
              if (!showForm) setEditingProduct(null);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              message.includes('Failed')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {['overview', 'products', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {tab === 'overview'
                  ? '📊 Overview'
                  : tab === 'products'
                  ? `📦 Products (${products.length})`
                  : `🛒 Orders (${stats.totalSales})`}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Performance Overview</h2>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalSales}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-purple-600">${stats.totalEarnings}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.lowStockItems}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold mb-3">Recent Orders</h3>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-3 rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-bold text-green-600">${order.total}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="p-6">
              {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
                  <h2 className="text-xl font-bold mb-4">
                    {editingProduct ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg px-4 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-4 py-2"
                        >
                          <option value="Vegetables">Vegetables</option>
                          <option value="Fruits">Fruits</option>
                          <option value="Grains">Grains</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Poultry">Poultry</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity (kg) *</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          required
                          min="1"
                          className="w-full border rounded-lg px-4 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Price ($/kg) *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0.01"
                          step="0.01"
                          className="w-full border rounded-lg px-4 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          className="w-full border rounded-lg px-4 py-2"
                        ></textarea>
                      </div>

                      <div className="md:col-span-2">
                        <ImageUpload
                          currentImage={formData.imageUrl}
                          onUploadSuccess={(url) =>
                            setFormData({ ...formData, imageUrl: url })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </form>
                </div>
              )}

              {/* Products List */}
              <h2 className="text-xl font-bold mb-4">My Products</h2>
              {products.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No products yet. Click “Add Product” to create your first listing!
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
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
                        <h3 className="font-bold text-lg">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-green-600 font-bold">${product.price}/kg</span>
                          <span
                            className={`text-sm ${
                              product.quantity < 10
                                ? 'text-orange-600 font-semibold'
                                : 'text-gray-500'
                            }`}
                          >
                            {product.quantity}kg {product.quantity < 10 && '⚠️'}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order History</h2>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {order.status}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm text-gray-600">Total Amount:</p>
                        <p className="text-2xl font-bold text-green-600">${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
