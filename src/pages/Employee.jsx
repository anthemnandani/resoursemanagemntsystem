import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteForever } from 'react-icons/md';
import axios from 'axios';
import EmployeeFormModal from '../components/EmployeeFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Navbar from '../components/Navbar';

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
      const response = await axios.get('https://resoursemanagemntsystem-bksn-8wfc9hn74.vercel.app/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
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
      await axios.delete(`https://resoursemanagemntsystem-bksn-8wfc9hn74.vercel.app/api/employees/${employeeToDelete._id}`);
      fetchEmployees();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto my-6 p-4">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold text-center">Employee List</h2>
        <button 
          className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
          onClick={() => {
            setCurrentEmployee(null);
            setIsModalOpen(true);
          }}
        >
          <FaPlus />
        </button>
      </div>

      <table className="w-full border-collapse border border-blue-900 shadow-md">
      <thead>
          <tr className="bg-blue-900 border-blue-900 text-white">
            <th className="p-2 border">Profile</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Position</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Hire Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="text-center border-b">
              <td className="p-2 flex justify-center items-center">
                <img 
                  src={employee.profilePicture || '/employee.jpg'} 
                  alt={employee.name} 
                  className="h-12 w-12 rounded-full object-cover" 
                />
              </td>
              <td className="p-2 border">{employee.name || 'N/A'}</td>
              <td className="p-2 border">{employee.email}</td>
              <td className="p-2 border">{employee.position}</td>
              <td className="p-2 border">{employee.department}</td>
              <td className="p-2 border">
                {new Date(employee.hireDate).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </td>
              <td className="p-2 border">
                <button 
                  className="bg-neutral-200 text-blue-500 text-2xl px-2 py-1 rounded mr-2 cursor-pointer"
                  onClick={() => handleEditClick(employee)}
                >
                  <CiEdit />
                </button>
                <button 
                  className="bg-neutral-200 text-red-700 text-2xl px-2 py-1 rounded cursor-pointer"
                  onClick={() => handleDeleteClick(employee)}
                >
                  <MdOutlineDeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        itemName={employeeToDelete?.name || 'this employee'}
      />
    </div>
    </>
  );
};