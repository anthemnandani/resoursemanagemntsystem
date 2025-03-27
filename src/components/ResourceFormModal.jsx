import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  resourceData = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'laptop',
    customType: '',
    description: '',
    purchaseDate: '',
    status: 'available',
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resourceData) {
      setFormData({
        name: resourceData.name || '',
        type: resourceData.type || 'laptop',
        customType: resourceData.customType || '',
        description: resourceData.description || '',
        purchaseDate: resourceData.purchaseDate || '',
        status: resourceData.status || 'available',
        profilePicture: null, // Optional: Reset the image when editing
      });
      setImagePreview(resourceData.profilePicture || '');
    } else {
      setFormData({
        name: '',
        type: 'laptop',
        customType: '',
        description: '',
        purchaseDate: '',
        status: 'available',
        profilePicture: null,
      });
      setImagePreview('');
    }
  }, [resourceData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('customType', formData.customType);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('purchaseDate', formData.purchaseDate);
      formDataToSend.append('status', formData.status);

      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      let response;
      if (resourceData) {
        // Update existing resource
        response = await axios.put(
          `http://localhost:5000/api/resources/${resourceData._id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new resource
        response = await axios.post(
          'http://localhost:5000/api/resources/createresource',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-semibold">
            {resourceData ? 'Edit Resource' : 'Add Resource'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-1 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Resourse images</label>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-12 rounded overflow-hidden bg-gray-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
              <label className="flex flex-col items-center px-4 py-1 bg-white rounded-lg border border-blue-900 cursor-pointer">
                <span className="text-blue-900">Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Resource Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="laptop">Laptop</option>
              <option value="mouse">Mouse</option>
              <option value="keyboard">Keyboard</option>
              <option value="monitor">Monitor</option>
              <option value="phone">Phone</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Custom Type */}
          {formData.type === 'other' && (
            <div className="mb-1">
              <label className="block text-gray-700 mb-1">Custom Type</label>
              <input
                type="text"
                name="customType"
                value={formData.customType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>

          {/* Purchase Date */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status */}
          <div className="mb-1">
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-900 text-white rounded flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                resourceData ? 'Update Resource' : 'Create Resource'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;