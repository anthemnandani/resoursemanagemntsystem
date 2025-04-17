import React, { useState, useEffect } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const ResourceFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  resourceData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when modal opens or resourceData changes
  useEffect(() => {
    if (resourceData) {
      setFormData({
        name: resourceData.name || "",
        description: resourceData.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
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

    try {
      let response;
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      if (resourceData) {
        // Update existing resource
        response = await axios.put(
          `https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype/${resourceData._id}`,
          payload
        );
      } else {
        // Create new resource
        response = await axios.post(
          "https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype",
          payload
        );
      }
      toast.success(response.data.message);
      // console.log("sucess message: ", response.data.message);

      setTimeout(() => {
        onSuccess(response.data);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.error || "failded to create please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">
            {resourceData ? "Edit Resource Type" : "Add Resource Type"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl hover:text-gray-700"
          >
            <RxCross1 />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <div className="flex items-center gap-1">
              <label className="block text-gray-700">Name</label>
              <span className="text-red-600">*</span>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter resource type name"
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <label className="block text-gray-700">Description</label>
                <span className="text-red-600">*</span>
              </div>
              <span className="text-sm text-gray-500">
                {formData.description?.length || 0} / 500
              </span>
            </div>
            <textarea
              name="description"
              placeholder="Enter a brief description"
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              rows="4"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-200 w-full rounded-full hover:bg-neutral-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 w-full flex items-center justify-center bg-[#4361ee] text-white rounded-full hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                </>
              ) : resourceData ? (
                "Update ResourceType"
              ) : (
                "Create ResourceType"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;
