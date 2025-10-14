import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// ============ PRODUCT ENDPOINTS ============
export const productAPI = {
  getAll: () => api.get('/products'),
  getMy: () => api.get('/products/my'),
  create: (productData) => api.post('/products/create', productData),
  getById: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data), // ✅ updated to match backend
  delete: (id) => api.delete(`/products/${id}`),          // ✅ soft delete
};

// ============ ORDER ENDPOINTS ============
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMy: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
};

// ============ MESSAGE ENDPOINTS ============
export const messageAPI = {
  send: (data) => api.post('/messages/send', data),
  getInbox: () => api.get('/messages/inbox'),
  getSent: () => api.get('/messages/sent'),
  getById: (id) => api.get(`/messages/${id}`),
};

// ============ USER ENDPOINTS ============
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  submitVerification: (data) => api.post('/users/verify', data),
};

// ============ ADMIN ENDPOINTS ============
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  getVerifications: () => api.get('/admin/verifications'),
  reviewVerification: (id, status, reason) =>
    api.patch(`/admin/verifications/${id}`, { status, reason }),
  getAllOrders: () => api.get('/admin/orders'),
};

export default api;
