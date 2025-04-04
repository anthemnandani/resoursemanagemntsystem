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
    resourceTypeId: '',
    description: '',
    totalResourceCount: '',
    avaliableResourceCount: '',
    purchaseDate: '',
    status: 'Available',
  });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch resource types when component mounts
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await axios.get('https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype');
        setResourceTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching resource types:', error);
      }
    };
    fetchResourceTypes();
  }, []);

  // Initialize form data when modal opens or resourceData changes
  useEffect(() => {
    if (resourceData) {
      setFormData({
        name: resourceData.name || '',
        resourceTypeId: resourceData.resourceType?._id || '',
        description: resourceData.description || '',
        totalResourceCount: resourceData.totalResourceCount || '',
        avaliableResourceCount: resourceData.avaliableResourceCount || '',
        purchaseDate: resourceData.purchaseDate?.split('T')[0] || '',
        status: resourceData.status || 'Available',
      });
    } else {
      setFormData({
        name: '',
        resourceTypeId: '',
        description: '',
        totalResourceCount: '',
        avaliableResourceCount: '',
        purchaseDate: '',
        status: 'Available',
      });
    }
  }, [resourceData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      const payload = {
        name: formData.name,
        resourceTypeId: formData.resourceTypeId,
        description: formData.description,
        totalResourceCount: formData.totalResourceCount,
        avaliableResourceCount: resourceData 
        ? formData.avaliableResourceCount 
        : formData.totalResourceCount,
        purchaseDate: formData.purchaseDate,
        status: formData.status,
      };

      if (resourceData) {
        // Update existing resource
        response = await axios.put(
          `https://resoursemanagemntsystem-bksn.vercel.app/api/resources/updateresourse/${resourceData._id}`,
          payload
        );
      } else {
        // Create new resource
        response = await axios.post(
          'https://resoursemanagemntsystem-bksn.vercel.app/api/resources/createresourse',
          payload
        );
      }

      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'failded to create please try again');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">
            {resourceData ? 'Edit Resource' : 'Add Resource'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-2 p-1 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

        <div className="mb-2">
            <label className="block text-gray-700 mb-1">Resource Type</label>
            <select
              name="resourceTypeId"
              value={formData.resourceTypeId}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
              required
            >
              <option value="">-- Select Resource Type --</option>
              {resourceTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-2">
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

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
              rows="3"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Total Resource</label>
            <input
              type="number"
              name="totalResourceCount"
              value={formData.totalResourceCount}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            />
          </div>

          {/* <div className="mb-2">
            <label className="block text-gray-700 mb-1">Avaliable Resourse</label>
            <input
              type="number"
              name="avaliableResourceCount"
              value={formData.avaliableResourceCount}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            />
          </div> */}

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            />
          </div>

          {/* Status */}
          {/* <div className="mb-2">
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            >
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div> */}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-neutral-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#013a63] text-white rounded hover:bg-blue-900 flex items-center gap-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
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