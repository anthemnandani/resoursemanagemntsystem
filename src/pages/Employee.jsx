import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from "axios";
import EmployeeFormModal from "../components/EmployeeFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Navbar from "../components/Navbar";

export const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 overflow-y-scroll">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Employees</h2>
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
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

        <div className="relative rounded shadow-sm border border-gray-200">
  <table className="w-full text-sm text-left text-gray-700">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
      <tr>
        <th scope="col" className="px-6 py-3.5 font-medium">Profile</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Name</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Email</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Position</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Department</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Hire Date</th>
        <th scope="col" className="px-6 py-3.5 font-medium">Status</th>
        <th scope="col" className="px-6 py-3.5 font-medium text-center">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {employees.length > 0 ? (
        employees.map((employee) => (
          <tr key={employee._id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 flex justify-center">
              <img
                src={employee.profilePicture || "/employee.jpg"}
                alt={employee.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </td>
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {employee.name || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {employee.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {employee.position}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {employee.department}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(employee.hireDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.status === "active" 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}>
                {employee.status}
              </span>
            </td>
            <td className="px-6 py-4 flex justify-center space-x-3">
              <button
                onClick={() => handleEditClick(employee)}
                className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 rounded hover:bg-blue-50"
                title="Edit"
              >
                <CiEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteClick(employee)}
                className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded hover:bg-red-50"
                title="Delete"
              >
                <MdOutlineDeleteForever className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="px-6 py-4 text-center text-gray-500 italic">
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
