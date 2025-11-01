// src/pages/FarmerDashboard.jsx (ENHANCED with Order Management)
import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalEarnings: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    category: 'Vegetables',
    description: '',
    quantity: '',
    price: '',
    imageUrl: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch products and orders
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getMy(),
        axios.get(`${API_URL}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);

      // Calculate stats
      const totalSales = ordersRes.data.length;
      const totalEarnings = ordersRes.data.reduce((sum, order) => {
        const orderTotal = order.products.reduce(
          (s, p) => s + p.price * p.quantity,
          0
        );
        return sum + orderTotal;
      }, 0);

      const lowStockItems = productsRes.data.filter(p => p.quantity < 10).length;
      const pendingOrders = ordersRes.data.filter(o => o.status === 'pending').length;
      const completedOrders = ordersRes.data.filter(o => o.status === 'delivered').length;

      setStats({
        totalProducts: productsRes.data.length,
        totalSales,
        totalEarnings: totalEarnings.toFixed(2),
        lowStockItems,
        pendingOrders,
        completedOrders
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
          <p className="text-gray-600">Welcome back, {user?.name}</p>
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: `Products (${products.length})` },
              { id: 'orders', label: `Orders (${orders.length})` },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
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
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalSales}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-purple-600">ZMW{stats.totalEarnings}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold mb-3">Recent Orders</h3>
                {orders.slice(0, 5).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-3 rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {order.products.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ${order.products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
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
                        <label className="block text-sm font-medium mb-1">Product Name </label>
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
                        <label className="block text-sm font-medium mb-1">Category </label>
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
                        <label className="block text-sm font-medium mb-1">Quantity (kg) </label>
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
                        <label className="block text-sm font-medium mb-1">Price (ZMW/kg) *</label>
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
                  No products yet. Click "Add Product" to create your first listing!
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
                            {product.quantity}kg {product.quantity < 10 && '(low)'}
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
              <h2 className="text-xl font-bold mb-4">Order Management</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="mb-2 flex justify-center"><svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v6a2 2 0 01-1 1.732l-7 4.041a2 2 0 01-2 0l-7-4.041A2 2 0 014 13V7m16 0l-8 4m-8-4l8 4"/></svg></div>
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-3 mb-3">
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{product.title} x {product.quantity}kg</span>
                              <span className="font-semibold">${(product.price * product.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-green-600">
                            ${order.products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Status Update Actions */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex gap-2 border-t pt-3">
                          <select
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            defaultValue=""
                          >
                            <option value="" disabled>Update Status</option>
                            {order.status === 'pending' && (
                              <option value="processing">Mark as Processing</option>
                            )}
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <option value="shipped">Mark as Shipped</option>
                            )}
                            {order.status === 'shipped' && (
                              <option value="delivered">Mark as Delivered</option>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Sales Analytics</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Order Status Breakdown */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-bold mb-3">Order Status</h3>
                  <div className="space-y-2">
                    {[
                      { status: 'pending', label: 'Pending', color: 'yellow' },
                      { status: 'processing', label: 'Processing', color: 'blue' },
                      { status: 'shipped', label: 'Shipped', color: 'purple' },
                      { status: 'delivered', label: 'Delivered', color: 'green' },
                      { status: 'cancelled', label: 'Cancelled', color: 'red' }
                    ].map(({ status, label, color }) => {
                      const count = orders.filter(o => o.status === status).length;
                      const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(0) : 0;
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{label}</span>
                            <span className="font-semibold">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-${color}-500 h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-bold mb-3">Top Products</h3>
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-sm">No products yet</p>
                  ) : (
                    <div className="space-y-2">
                      {products.slice(0, 5).map((product, idx) => (
                        <div key={product.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                            <span className="text-sm">{product.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            ${product.price}/kg
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alert */}
              {stats.lowStockItems > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-bold text-orange-800 mb-2">Low Stock Alert</h3>
                  <p className="text-sm text-orange-700">
                    You have {stats.lowStockItems} product(s) with less than 10kg in stock.
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="mt-2 text-sm text-orange-600 underline hover:text-orange-800"
                  >
                    View Products
                  </button>
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