// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      alert('Access denied. Admins only.');
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [role, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, verificationsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        adminAPI.getVerifications(),
        adminAPI.getOrders()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setVerifications(verificationsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setMessage('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationReview = async (userId, status) => {
    setMessage('');
    try {
      await adminAPI.reviewVerification(userId, status);
      setMessage(`Verification ${status === 'verified' ? 'approved' : 'rejected'} successfully!`);
      fetchDashboardData();
    } catch (err) {
      setMessage('Failed to update verification status');
    }
  };

  const handleUserStatusUpdate = async (userId, status) => {
    setMessage('');
    try {
      await adminAPI.updateUserStatus(userId, status);
      setMessage(`User status updated to ${status}`);
      fetchDashboardData();
    } catch (err) {
      setMessage('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              message.toLowerCase().includes('success') || message.toLowerCase().includes('approved')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'verifications'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              Verifications ({verifications.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Platform Statistics</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.totalProducts || 0}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalOrders || 0}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Verifications</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats?.pendingVerifications || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.role === 'farmer'
                                ? 'bg-green-100 text-green-700'
                                : user.role === 'buyer'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.verification_status === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : user.verification_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.verification_status || 'unverified'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            onChange={(e) => handleUserStatusUpdate(user.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Actions
                            </option>
                            <option value="active">Activate</option>
                            <option value="suspended">Suspend</option>
                            <option value="banned">Ban</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VERIFICATIONS */}
          {activeTab === 'verifications' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Pending Verifications</h2>
              {verifications.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No pending verifications</p>
              ) : (
                <div className="space-y-4">
                  {verifications.map((v) => (
                    <div key={v.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{v.name}</h3>
                          <p className="text-sm text-gray-600">{v.email}</p>
                          <p className="text-sm text-gray-600">NRC: {v.nrc_number}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerificationReview(v.id, 'verified')}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerificationReview(v.id, 'rejected')}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      {v.nrc_photo_url && (
                        <div className="mt-3">
                          <img
                            src={v.nrc_photo_url}
                            alt="NRC"
                            className="h-32 object-contain border rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">All Orders</h2>
              {orders.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-3">{order.id}</td>
                          <td className="px-4 py-3">{order.customerName}</td>
                          <td className="px-4 py-3">{order.productName}</td>
                          <td className="px-4 py-3">{order.quantity}</td>
                          <td className="px-4 py-3">${order.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
