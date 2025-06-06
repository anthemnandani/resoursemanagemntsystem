import React, { useState, useEffect } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const AllocationFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  allocationData = null,
  selectedEmployeeId = "",
  selectedResourceId = "",
}) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    resourceId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [resources, setResources] = useState([]);

  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [isManualTypeChange, setIsManualTypeChange] = useState(false);


  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const [employeesRes, resourcesRes, resourceTypesRes] = await Promise.all([
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/employees"),
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/resources/getAvaliableResources"),
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype"),
      ]);

      // Only active employees
      setEmployees(
        (employeesRes.data || []).filter(
          (emp) => emp.status === "Active" && !emp.isDeleted
        )
      );

      // Sort resources alphabetically
      const sortedResources = (resourcesRes.data.data || []).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setResources(sortedResources);

      // Sort resource types alphabetically
      setResourceTypes(
        (resourceTypesRes.data.data || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      if (selectedEmployeeId) {
        setFormData((prev) => ({ ...prev, employeeId: selectedEmployeeId }));
      }

      if (selectedResourceId) {
        setFormData((prev) => ({ ...prev, resourceId: selectedResourceId }));

        const matchedResource = sortedResources.find(
          (res) => res._id === selectedResourceId
        );

        if (matchedResource && matchedResource.resourceType?._id) {
          setSelectedResourceType(matchedResource.resourceType._id);
        }
      }
      setIsManualTypeChange(false);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  if (isOpen) {
    fetchData();
  }
}, [isOpen, selectedEmployeeId, selectedResourceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/allocate",
        {
          employeeId: formData.employeeId,
          resourceId: formData.resourceId,
          AllocatedDate: formData.AllocatedDate,
        }
      );

      toast.success(response.data.message);
      setFormData( {employeeId: "",
        resourceId: ""} );
      // console.log("success: " ,response.data.message);
      setTimeout(() => {
        onSuccess(response.data);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Allocation error:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to allocate resource. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isManualTypeChange) {
      setFormData((prev) => ({ ...prev, resourceId: "" }));
    }
  }, [selectedResourceType, isManualTypeChange]);
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {allocationData ? "Update Allocation" : "Allocate Resource"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            <RxCross1 />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {[...employees]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.position} - {employee.department}
                    )
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Resource Type</label>
            <select
              value={selectedResourceType}
              onChange={(e) => {
                setSelectedResourceType(e.target.value);
                setIsManualTypeChange(true);
              }}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {[...resourceTypes]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Available Resources
            </label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
              required
            >
              <option value="">Select Resource</option>
              {[...resources]
                .filter((resource) =>
                  selectedResourceType
                    ? resource.resourceType?._id === selectedResourceType
                    : true
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((resource) => {
                  const capitalizedName =
                    resource.name.charAt(0).toUpperCase() +
                    resource.name.slice(1);
                  return (
                    <option key={resource._id} value={resource._id}>
                      {capitalizedName} (
                      {resource.resourceType?.name || resource.type})
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Allocated Date</label>
            <input
              type="date"
              name="AllocatedDate"
              value={formData.AllocatedDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-0 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
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
              className="px-4 py-2 w-full flex items-center justify-center bg-[#4361ee] text-white rounded-full hover:bg-blue-700"
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
              ) : (
                "Allocate Resource"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocationFormModal;
