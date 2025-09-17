// frontend/src/pages/VerifyFarmerForm.jsx
import { useState } from "react";
import axios from "axios";

export default function VerifyFarmerForm() {
  const [nrcNumber, setNrcNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let photoUrl = "";
      if (photo) {
        // Reuse existing uploadImage utility
        const formData = new FormData();
        formData.append("file", photo);
        const res = await axios.post("/api/storage/upload", formData); // Or use Firebase directly
        photoUrl = res.data.url;
      }

      await axios.post(
        "http://localhost:5000/api/users/verify",
        { nrcNumber, nrcPhotoUrl: photoUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("✅ Verification submitted! Admin will review soon.");
    } catch (err) {
      setMessage("❌ Failed to submit verification: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2>🔐 Verify Your Identity</h2>
      <p>Upload your NRC to become a <strong>Verified Farmer</strong>.</p>

      {message && (
        <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>NRC Number (e.g., 123456/78/9)</label>
          <input
            type="text"
            value={nrcNumber}
            onChange={(e) => setNrcNumber(e.target.value)}
            className="form-control"
            placeholder="123456/78/9"
            required
          />
        </div>

        <div className="mb-3">
          <label>Photo of NRC Document</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}