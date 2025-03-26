import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerModal from "./CustomerModal";
import { FiPlus } from "react-icons/fi";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [modalData, setModalData] = useState(null); // Holds data for Edit Mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://customer-management-system-2ia8.vercel.app/api/customers");
      setCustomers(res.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://customer-management-system-2ia8.vercel.app/api/customers/${deleteCustomerId}`
      );
      setCustomers(customers.filter((c) => c._id !== deleteCustomerId));
      setShowDeleteConfirm(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="container mx-auto my-6 p-4">
      <h2 className="text-4xl mb-8 font-bold text-center">Customer Management System</h2>
      <div className="flex justify-between items-cente py-4">
        <h2 className="text-2xl font-semibold text-center">Customer List</h2>
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => {
            setModalData(null);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
        </button>
      </div>
      <table className="w-full border-collapse border border-blue-900 shadow-md">
        <thead>
          <tr className="bg-blue-900 border-blue-900  text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Membership</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer._id}
              className="text-center border-b"
            >
              <td className="p-2 border">
                {customer.firstName} {customer.lastName}
              </td>
              <td className="p-2 border">{customer.email}</td>
              <td className="p-2 border">{customer.contactNumber}</td>
              <td className="p-2 border">{customer.status}</td>
              <td className="p-2 border">{customer.membershipID?.name}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-700 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                  onClick={() => {
                    setModalData(customer);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-700 text-white px-3 py-1 rounded cursor-pointer"
                  onClick={() => {
                    setDeleteCustomerId(customer._id);
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Customer Form Modal */}
      {isModalOpen && (
        <CustomerModal
          closeModal={() => setIsModalOpen(false)}
          modalData={modalData}
          fetchCustomers={fetchCustomers}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete this customer?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerTable;