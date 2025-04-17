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
    resourceTypeId: "",
    description: "",
    totalResourceCount: "",
    avaliableResourceCount: "",
    purchaseDate: "",
    status: "Available",
    images: null,
    documents: null,
    warrantyExpiryDate: "",
  });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleRemoveImage = (indexToRemove) => {
    const updatedPreviews = imagePreviews.filter(
      (_, idx) => idx !== indexToRemove
    );
    const updatedFiles = Array.from(formData.images).filter(
      (_, idx) => idx !== indexToRemove
    );

    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedFiles });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Fetch resource types when component mounts
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await axios.get(
          "https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype"
        );
        setResourceTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching resource types:", error);
      }
    };
    fetchResourceTypes();
  }, []);

  // Initialize form data when modal opens or resourceData changes
  useEffect(() => {
    if (resourceData) {
      setFormData({
        name: resourceData.name || "",
        resourceTypeId: resourceData.resourceType?._id || "",
        description: resourceData.description || "",
        totalResourceCount: resourceData.totalResourceCount || "",
        avaliableResourceCount: resourceData.avaliableResourceCount || "",
        purchaseDate: resourceData.purchaseDate?.split("T")[0] || "",
        warrantyExpiryDate:
          resourceData.warrantyExpiryDate?.split("T")[0] || "",
        status: resourceData.status || "Available",
        images: null,
        documents: null,
      });

      const existingImages = resourceData.images?.map((img) => img.url) || [];
      setImagePreviews(existingImages);
    } else {
      setFormData({
        name: "",
        resourceTypeId: "",
        description: "",
        totalResourceCount: "",
        avaliableResourceCount: "",
        purchaseDate: "",
        warrantyExpiryDate: "",
        status: "Available",
        images: null,
        documents: null,
      });

      setImagePreviews([]);
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

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("resourceTypeId", formData.resourceTypeId);
      payload.append("description", formData.description);
      payload.append("totalResourceCount", formData.totalResourceCount);
      payload.append(
        "avaliableResourceCount",
        resourceData
          ? formData.avaliableResourceCount
          : formData.totalResourceCount
      );
      payload.append("purchaseDate", formData.purchaseDate);
      payload.append("warrantyExpiryDate", formData.warrantyExpiryDate);
      payload.append("status", formData.status);

      // Append images if available
      if (formData.images) {
        for (let i = 0; i < formData.images.length; i++) {
          payload.append("images", formData.images[i]);
        }
      }

      // Append document files if available
      if (formData.documents) {
        for (let i = 0; i < formData.documents.length; i++) {
          payload.append("documents", formData.documents[i]);
        }
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (resourceData) {
        // Update existing resource
        response = await axios.put(
          `https://resoursemanagemntsystem-bksn.vercel.app/api/resources/updateresourse/${resourceData._id}`,
          payload,
          config
        );
      } else {
        // Create new resource
        response = await axios.post(
          "https://resoursemanagemntsystem-bksn.vercel.app/api/resources/createresourse",
          payload,
          config
        );
      }
      toast.success(response.data.message);

      setTimeout(() => {
        onSuccess(response.data);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.error || "Failed to create, please try again"
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
            {resourceData ? "Edit Resource" : "Add Resource"}
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
            <div className="flex">
              <label className="block text-gray-700 mb-1">Resource Name</label>{" "}
              <span className="text-red-600">*</span>
            </div>
            <input
              type="text"
              name="name"
              placeholder="Type resource name here..."
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex gap-2 mb-2">
            <div className="w-full">
              <div className="flex">
                <label className="block text-gray-700 mb-1">
                  Resource Type
                </label>{" "}
                <span className="text-red-600">*</span>
              </div>
              <select
                name="resourceTypeId"
                value={formData.resourceTypeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
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

            <div className="mb-2 w-full">
              <label className="block text-gray-700 mb-1">Total units</label>
              <input
                type="number"
                name="totalResourceCount"
                placeholder="e.g., 5"
                min={1}
                step={1}
                value={formData.totalResourceCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* <div className="mb-2">
            <label className="block text-gray-700 mb-1">Avaliable Resourse</label>
            <input
              type="number"
              name="avaliableResourceCount"
              value={formData.avaliableResourceCount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div> */}

          <div className="flex gap-2 mb-2">
            <div className="mb-2 w-full">
              <label className="block text-gray-700 mb-1">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              />
            </div>

            <div className="mb-2 w-full">
              <label className="block text-gray-700 mb-1">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                name="warrantyExpiryDate"
                value={formData.warrantyExpiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              />
            </div>
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
              value={formData.description || ""}
              placeholder="Color, style, or appearance..."
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              rows="3"
              maxLength={500}
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex">
              <label className="block text-gray-700 mb-1">Upload Images</label>{" "}
              <span className="text-red-600">*</span>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <input
                type="file"
                name="images"
                accept=".png,.jpg,.jpeg"
                multiple
                onChange={(e) => {
                  setFormData({ ...formData, images: e.target.files });

                  const previews = Array.from(e.target.files).map((file) =>
                    URL.createObjectURL(file)
                  );
                  setImagePreviews(previews);
                }}
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0 file:text-sm file:font-semibold
                 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border-gray-300"
                required={!resourceData}
              />
            </div>

            {imagePreviews?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute text-sm top-1 right-1 h-6 w-6 bg-white rounded-full shadow text-red-600 hover:bg-red-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Upload Documents</label>

            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <input
                type="file"
                name="documents"
                accept=".pdf"
                multiple
                onChange={(e) =>
                  setFormData({ ...formData, documents: e.target.files })
                }
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
       file:rounded-full file:border-0 file:text-sm file:font-semibold
       file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {formData.documents?.length > 0 && (
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                {Array.from(formData.documents).map((doc, index) => (
                  <li key={index}>{doc.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Status */}
          {/* <div className="mb-2">
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
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
              className="px-4 py-2 bg-gray-200 w-full rounded-full hover:bg-neutral-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 w-full bg-[#4361ee] flex items-center justify-center text-white rounded-full hover:bg-blue-700"
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
                "Update Resource"
              ) : (
                "Create Resource"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;
