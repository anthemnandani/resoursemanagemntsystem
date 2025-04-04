import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import EmployeeFormModal from "../components/EmployeeFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Navbar from "../components/Navbar";
import { IoMdEye } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const Employee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const [activeAllocations, setActiveAllocations] = useState({});
  const [openTooltip, setOpenTooltip] = useState(null); // Tracks which tooltip is open

  const fetchAllocations = async (employeeId) => {
    try {
      const response = await axios.get(
        `https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/employee/${employeeId}`
      );
      setActiveAllocations((prev) => ({
        ...prev,
        [employeeId]: response.data.allocations,
      }));
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  const handleClick = (employeeId) => {
    if (openTooltip === employeeId) {
      setOpenTooltip(null); // Close tooltip if already open
    } else {
      fetchAllocations(employeeId);
      setOpenTooltip(employeeId); // Open tooltip for clicked employee
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".tooltip-container")) {
        setOpenTooltip(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, activeFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/employees");
      const data = response.data;
      setEmployees(data);
      updateCounts(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const filterEmployees = () => {
    switch (activeFilter) {
      case "active":
        setFilteredEmployees(
          employees.filter((emp) => emp.status === "active")
        );
        break;
      case "inactive":
        setFilteredEmployees(
          employees.filter((emp) => emp.status === "inactive")
        );
        break;
      default:
        setFilteredEmployees(employees);
    }
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const updateCounts = (data) => {
    const allCount = data.length;
    const activeCount = data.filter((res) => res.status === "active").length;
    const inactiveCount = data.filter(
      (res) => res.status === "inactive"
    ).length;
    setCounts({ all: allCount, active: activeCount, inactive: inactiveCount });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://resoursemanagemntsystem-bksn.vercel.app/api/employees/${employeeToDelete._id}`
      );
      fetchEmployees();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const toggleEmployeeStatus = async (employee) => {
    try {
      const newStatus = employee.status === "active" ? "inactive" : "active";
      await axios.patch(`https://resoursemanagemntsystem-bksn.vercel.app/api/employees/${employee._id}`, {
        status: newStatus,
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 overflow-y-scroll pt-14">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Employees</h2>
          <button
            className="bg-[#013a63] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
            onClick={() => {
              setCurrentEmployee(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <div className="absolute z-50 hidden group-hover:block min-w-[150px] max-w-[400px] p-2 bg-white border border-gray-200 rounded-md shadow-md -top-3 right-2 -translate-x-1/5 transform translate-y-[-80%]">
              <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                Add new employee
              </div>
            </div>
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "all" ? "bg-[#013a63] text-white" : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All ({counts.all})
          </button>
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "active" ? "bg-[#013a63] text-white" : ""
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Active ({counts.active})
          </button>
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "inactive" ? "bg-[#013a63] text-white" : ""
            }`}
            onClick={() => setActiveFilter("inactive")}
          >
            Inactive ({counts.inactive})
          </button>
        </div>

        <div className="relative shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Profile
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Department
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Position
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Hire Date
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-2 py-4 flex justify-center">
                      <img
                        src={employee.profilePicture || "/employee.jpg"}
                        alt={employee.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {employee.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {employee.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {employee.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {employee.position}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleEmployeeStatus(employee)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          employee.status === "active"
                            ? "bg-green-50 text-green-800 hover:bg-green-100"
                            : "bg-red-50 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {employee.status}
                      </button>
                    </td>
                    <td className="px-4 py-4 flex justify-center">
                      <div className="relative inline-block tooltip-container">
                        <button
                          className="text-[#013a63] cursor-pointer hover:text-blue-900 transition-colors p-1.5 rounded relative"
                          onClick={() => handleClick(employee._id)}
                        >
                          <IoMdEye className="w-5 h-5" />
                        </button>

                        {/* Tooltip (Shows on Click) */}
                        {openTooltip === employee._id &&
                          activeAllocations[employee._id]?.length > 0 && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white shadow-lg rounded p-2 text-sm border z-50">
                              <div className="text-md mb-3 font-semibold">
                                All Allocated Resources
                              </div>
                              <hr />
                              <div>
                                {activeAllocations[employee._id].map(
                                  (alloc, index) => (
                                    <div
                                      key={index}
                                      className="border-b pb-1 mb-1 last:border-none"
                                    >
                                      <p className="font-semibold">
                                        {alloc.resourceName} (
                                        {alloc.resourceType})
                                      </p>
                                      <p className="text-gray-500 text-xs">
                                        Status: {alloc.status} | Allocated on:{" "}
                                        {new Date(
                                          alloc.allocationDate
                                        ).toLocaleDateString()}
                                      </p>
                                      {alloc.returnDate && (
                                        <p className="text-gray-500 text-xs">
                                          Return Date:{" "}
                                          {new Date(
                                            alloc.returnDate
                                          ).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-[#013a63] cursor-pointer hover:text-blue-900 transition-colors p-1.5 rounded"
                        title="Edit"
                      >
                        <CiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee)}
                        className="text-red-800 cursor-pointer hover:text-red-700 transition-colors p-1.5 rounded"
                        title="Delete"
                      >
                        <MdOutlineDeleteForever className="w-5 h-5" />
                      </button>
                      <button className="text-black cursor-pointer transition-colors p-1.5 rounded relative group">
                        <BsThreeDotsVertical
                          className="w-5 h-5"
                          onClick={() => navigate("/allocations")}
                        />
                        <div className="absolute z-50 hidden group-hover:block rounded-md shadow-md -top-10 right-1 -translate-x-1/5 transform translate-y-[-0%]">
                          <button className="text-sm text-blue-900 px-4 py-2 bg-neutral-50 font-semibold min-h-10 min-w-48 overflow-y-auto">
                            Allocate new resource
                          </button>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-4 text-center text-gray-500 italic"
                  >
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EmployeeFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEmployees}
          employeeData={currentEmployee}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={employeeToDelete?.name || "this employee"}
        />
      </div>
    </>
  );
};
