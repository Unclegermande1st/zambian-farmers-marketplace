// frontend/src/pages/AddProductForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadImage } from "../utils/uploadImage";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = "";

      // Upload image if provided
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Save product
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/products/create",
        { ...formData, quantity: Number(formData.quantity), price: Number(formData.price), imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate("/farmer/dashboard"), 1500);
    } catch (err) {
      setMessage("Failed to list product. " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2> Add New Product</h2>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Category</option>
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Poultry">Poultry</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Price (Kwacha)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Uploading..." : "List Product"}
        </button>

        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate("/farmer/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}