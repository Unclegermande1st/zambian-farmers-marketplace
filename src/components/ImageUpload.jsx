import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));

    // Upload to backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUploadSuccess(res.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Product Image</label>
      
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100
          disabled:opacity-50"
      />

      {uploading && (
        <p className="text-sm text-blue-600">Uploading image...</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;