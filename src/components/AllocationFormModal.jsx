import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllocationFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  allocationData = null,
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    resourceId: ''
  });
  const [employees, setEmployees] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees and Available resources when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, resourcesRes] = await Promise.all([
          axios.get('https://resoursemanagemntsystem-bksn.vercel.app/api/employees'),
          axios.get('https://resoursemanagemntsystem-bksn.vercel.app/api/resources/getAvaliableResources')
        ]);
        
        setEmployees(employeesRes.data);
        setResources(resourcesRes.data.data);
        console.log("employees result data: ", employeesRes.data);
        console.log("resourse result data: ", resourcesRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/allocate',
        {
          employeeId: formData.employeeId,
          resourceId: formData.resourceId,
          AllocatedDate: formData.AllocatedDate,
        }
      );

      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Allocation error:', error);
      setError(error.response?.data?.error || 'Failed to allocate resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {allocationData ? 'Update Allocation' : 'Allocate Resource'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.position} - {employee.department})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Available Resources</label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Resource</option>
              {resources.map(resource => (
                <option key={resource._id} value={resource._id}>
                  {resource.name} ({resource.resourceType?.name || resource.type})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Allocated Date</label>
            <input
              type="date"
              name="AllocatedDate"
              value={formData.AllocatedDate}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#013a63] text-white rounded hover:bg-blue-900 flex items-center gap-2"
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
                'Allocate Resource'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocationFormModal;