import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload'; // ✅ Import ImageUpload

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // ✅ new
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Vegetables',
    description: '',
    quantity: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getMy();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
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
        setMessage('Product updated successfully!');
        setEditingProduct(null);
      } else {
        await productAPI.create(formData);
        setMessage('Product created successfully!');
      }

      setShowForm(false);
      setFormData({
        title: '',
        category: 'Vegetables',
        description: '',
        quantity: '',
        price: '',
        imageUrl: ''
      });
      fetchMyProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save product');
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
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setMessage('');
    try {
      await productAPI.delete(productId);
      setMessage('Product deleted successfully!');
      fetchMyProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditingProduct(null);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {showForm ? 'Cancel' : editingProduct ? 'Edit Product' : '+ Add Product'}
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              message.includes('success')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
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
                    placeholder="e.g., Fresh Tomatoes"
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
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price per kg ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="5.99"
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
                    placeholder="Organic tomatoes grown without pesticides..."
                  ></textarea>
                </div>

                {/* ✅ Replace image URL input with ImageUpload component */}
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Products</h2>

          {loading ? (
            <p className="text-center py-8">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No products yet. Click "Add Product" to create your first listing!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden">
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
                    <div className="mt-2 flex justify-between">
                      <span className="text-green-600 font-bold">${product.price}/kg</span>
                      <span className="text-sm text-gray-500">{product.quantity}kg</span>
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
      </div>
    </div>
  );
};

export default FarmerDashboard;
