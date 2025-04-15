import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import EmployeeFormModal from "../components/EmployeeFormModal";
import AllocationFormModal from "../components/AllocationFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Navbar from "../components/Navbar";
import { SiTicktick } from "react-icons/si";
import { IoMdEye } from "react-icons/io";
import ViewDetailsModal from "../components/ViewDetailsModal";
import { Footer } from "../components/Footer";

export const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [ActiveFilter, setActiveFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, Active: 0, Inactive: 0 });
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");

  const [ActiveAllocations, setActiveAllocations] = useState({});
  const [openTooltip, setOpenTooltip] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [resourceToView, setResourceToView] = useState(null);

  const handleViewClick = (resource) => {
    setResourceToView(resource);
    setViewModalOpen(true);
  };

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

  //for tooltip
  const handleClick = (employeeId) => {
    if (openTooltip === employeeId) {
      setOpenTooltip(null);
    } else {
      fetchAllocations(employeeId);
      setOpenTooltip(employeeId);
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
  }, [employees, ActiveFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/employees");
      const data = response.data.reverse();
      setEmployees(data);
      updateCounts(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const filterEmployees = () => {
    switch (ActiveFilter) {
      case "Active":
        setFilteredEmployees(
          employees.filter((emp) => emp.status === "Active")
        );
        break;
      case "Inactive":
        setFilteredEmployees(
          employees.filter((emp) => emp.status === "Inactive")
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
    const ActiveCount = data.filter((res) => res.status === "Active").length;
    const InactiveCount = data.filter(
      (res) => res.status === "Inactive"
    ).length;
    setCounts({ all: allCount, Active: ActiveCount, Inactive: InactiveCount });
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
      const newStatus = employee.status === "Active" ? "Inactive" : "Active";
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
      <div className="container mx-auto my-6 p-4 pt-14 min-h-[85vh]">
        <div className="flex justify-between items-center py-2">
          <h2 className="text-2xl font-semibold text-center">Employees</h2>
          <button
            className="bg-[#4361ee] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
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
              ActiveFilter === "all" ? "bg-[#4361ee] text-white" : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All ({counts.all})
          </button>
          <button
            className={`py-1 px-3 rounded ${
              ActiveFilter === "Active" ? "bg-[#4361ee] text-white" : ""
            }`}
            onClick={() => setActiveFilter("Active")}
          >
            Active ({counts.Active})
          </button>
          <button
            className={`py-1 px-3 rounded ${
              ActiveFilter === "Inactive" ? "bg-[#4361ee] text-white" : ""
            }`}
            onClick={() => setActiveFilter("Inactive")}
          >
            Inactive ({counts.Inactive})
          </button>
        </div>

        <div className="relative border border-gray-200 overflow-x-scroll">
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
                  Allocated resources
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
                    className="bg-white hover:bg-blue-50/10 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 flex justify-center">
                      <img
                        src={employee.profilePicture.url || "/user.png"}
                        alt={employee.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {employee.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {employee.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {employee.department}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {employee.position}
                    </td>
                    <td className="px-4 py-2 flex justify-center">
                      <div className="relative inline-block tooltip-container">
                        <button
                          className="text-black cursor-pointer font-bold hover:text-blue-950 transition-colors p-1.5 rounded relative"
                          title="click to see all allocated resources to this employee"
                          onClick={() => handleClick(employee._id)}
                        >
                          {employee.allocatedResourceCount}
                        </button>

                        {/* Tooltip (Shows on Click) */}
                        {openTooltip === employee._id &&
                          ActiveAllocations[employee._id]?.length > 0 && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white shadow-lg rounded p-2 text-sm border z-50">
                              <div className="text-md mb-3 font-semibold">
                                All Allocated Resources
                              </div>
                              <hr />
                              <div>
                                {ActiveAllocations[employee._id].map(
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
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </p>
                                      {alloc.returnDate && (
                                        <p className="text-gray-500 text-xs">
                                          Return Date:{" "}
                                          {new Date(
                                            alloc.returnDate
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          })}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(employee.hireDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleEmployeeStatus(employee)}
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-50"
                            : "bg-red-100 text-red-800 hover:bg-red-50"
                        }`}
                      >
                        {employee.status}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex justify-center">
                      <button
                        onClick={() => handleViewClick(employee)}
                        className="text-black cursor-pointer hover:text-blue-950 transition-colors p-1.5 rounded"
                        title="View"
                      >
                        <IoMdEye className="w-5 h-5" />
                      </button>

                      {employee.status === "Active" && (
                        <>
                          <button
                            onClick={() => handleEditClick(employee)}
                            className="text-blue-900 cursor-pointer hover:text-blue-700 transition-colors p-1.5 rounded"
                            title="Edit Employee"
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
                          <div className="relative group">
                            <button
                              className="text-black cursor-pointer transition-colors p-1.5 rounded"
                              onClick={() => {
                                setCurrentEmployeeId(employee._id);
                                setIsAllocationModalOpen(true);
                              }}
                            >
                              <SiTicktick className="w-4 h-4" />
                            </button>
                            <div className="absolute z-50 hidden group-hover:block rounded-md shadow-md -top-10 right-1 -translate-x-1/5 transform translate-y-[-0%]">
                              <button className="text-sm text-blue-950 px-4 py-2 bg-neutral-50 font-semibold min-h-10 min-w-48 overflow-y-auto">
                                Allocate new resource
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-2 text-center text-gray-500 italic"
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

        <AllocationFormModal
          isOpen={isAllocationModalOpen}
          onClose={() => setIsAllocationModalOpen(false)}
          onSuccess={fetchAllocations}
          selectedEmployeeId={currentEmployeeId}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={employeeToDelete?.name || "this employee"}
        />

        <ViewDetailsModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={resourceToView}
          hiddenFields={[
            "__v",
            "_id",
            "createdAt",
            "images",
            "isDeleted",
            "id",
            "updatedAt",
          ]}
          title="Employee Details"
        />
      </div>
      <Footer />
    </>
  );
};
