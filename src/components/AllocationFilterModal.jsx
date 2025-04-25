import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

const AllocationFilterModal = ({ isOpen, onClose, onApply }) => {
  const [employees, setEmployees] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  const [filters, setFilters] = useState({
    allocationStartDate: "",
    allocationEndDate: "",
    returnStartDate: "",
    returnEndDate: "",
    employeeId: "",
    resourceId: "",
    resourceTypeId: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [empRes, resRes, typeRes] = await Promise.all([
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/employees"),
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/resources"),
        axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype"),
      ]);

      setEmployees(empRes.data);
      setResources(resRes.data.data);
      setResourceTypes(typeRes.data.data);
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[90%] max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Allocations</h2>
          <button onClick={onClose}>
            <RxCross1 className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-md pb-1">Allocation Start Date</label>
            <input
              type="date"
              name="allocationStartDate"
              value={filters.allocationStartDate}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-md pb-1">Allocation End Date</label>
            <input
              type="date"
              name="allocationEndDate"
              value={filters.allocationEndDate}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-md pb-1">Return Start Date</label>
            <input
              type="date"
              name="returnStartDate"
              value={filters.returnStartDate}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-md pb-1">Return End Date</label>
            <input
              type="date"
              name="returnEndDate"
              value={filters.returnEndDate}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-md pb-1">Employee</label>
            <select
              name="employeeId"
              value={filters.employeeId}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            >
              <option value="">All</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-md pb-1">Resource</label>
            <select
              name="resourceId"
              value={filters.resourceId}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            >
              <option value="">All</option>
              {resources.map((res) => (
                <option key={res._id} value={res._id}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-md pb-1">Resource Type</label>
            <select
              name="resourceTypeId"
              value={filters.resourceTypeId}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            >
              <option value="">All</option>
              {resourceTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
          <label className="block text-md pb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border rounded p-2 border-gray-300"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 w-full bg-gray-200 rounded-4xl">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="bg-[#4361ee] text-white px-4 py-2 w-full rounded-4xl"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocationFilterModal;
