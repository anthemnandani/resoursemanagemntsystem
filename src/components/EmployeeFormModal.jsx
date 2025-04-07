import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  employeeData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    hireDate: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || "",
        email: employeeData.email || "",
        position: employeeData.position || "",
        department: employeeData.department || "",
        hireDate: employeeData.hireDate?.split('T')[0] || '',
        profilePicture: null,
      });
      setImagePreview(employeeData.profilePicture || "");
    } else {
      setFormData({
        name: "",
        email: "",
        position: "",
        department: "",
        hireDate: "",
        profilePicture: null,
      });
      setImagePreview("");
    }
  }, [employeeData, isOpen]);

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
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("hireDate", formData.hireDate);

      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      let response;
      if (employeeData) {
        // Update existing employee
        response = await axios.put(
          `https://resoursemanagemntsystem-bksn.vercel.app/api/employees/${employeeData._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new employee
        response = await axios.post(
          "https://resoursemanagemntsystem-bksn.vercel.app/api/employees/createemployee",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            {employeeData ? "Edit Employee" : "Add Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
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
              <label className="flex flex-col items-center px-4 py-2 bg-white rounded-lg border border-[#013a63] cursor-pointer">
                <span className="text-[#013a63]">Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              // disabled={!!employeeData} // Disable email field for edits
            />
          </div>

          <div className="mb-1">
            <label className="block text-gray-700 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--Select option--</option>
              <option value="Software Development">Software Development</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Business Development">Business Development</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Management">Management</option>
              <option value="Administration">Administration</option>
              <option value="Design">Design</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <div className="mb-1">
            <label className="block text-gray-700 mb-2">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--Select option--</option>
              <option value="Developer">Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Team Lead">Team Lead</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Business Development Manager">Business Development Manager</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Admin">Admin</option>
              <option value="Accountant">Accountant</option>
              <option value="Designer">Designer</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Hire Date</label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              className="w-full p-1 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#013a63] text-white rounded flex items-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {employeeData ? "Updating..." : "Creating..."}
                </>
              ) : employeeData ? (
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
