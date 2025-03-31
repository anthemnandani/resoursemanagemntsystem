import React, { useState, useEffect } from "react";
import axios from "axios";
import AllocationFormModal from "../components/AllocationFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import Navbar from "../components/Navbar";

export const AllocatedResouses = () => {
  const [allocations, setAllocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/allocations");
      setAllocations(response.data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (allocation) => {
    setCurrentAllocation(allocation);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (allocation) => {
    setAllocationToDelete(allocation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/allocations/return/${allocationToDelete._id}`
      );
      fetchAllocations();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting allocation:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 pt-14">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Allocated Resources</h2>
          <button
            className="bg-[#013a63] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
            onClick={() => {
              setCurrentAllocation(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <div className="absolute z-50 hidden group-hover:block min-w-[150px] max-w-[400px] p-2 bg-white border border-gray-200 rounded-md shadow-md -top-3 right-2 -translate-x-1/5 transform translate-y-[-80%]">
              <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                Allocate Resource
              </div>
            </div>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#013a63]"></div>
          </div>
        ) : (
          <div className="relative rounded-lg shadow-sm border border-gray-200 overflow-visible">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-medium">Resource</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Employee</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Allocation Date</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3.5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allocations.length > 0 ? (
                  allocations.map((allocation) => (
                    <tr key={allocation._id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {allocation.resource?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{allocation.employee?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{allocation.employee?.position || ""}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(allocation.allocatedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          allocation.status === "active" 
                            ? "bg-green-50 text-green-800" 
                            : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {allocation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center space-x-3">
                        <button
                          onClick={() => handleEditClick(allocation)}
                          className="text-[#013a63] hover:text-[#013a63] transition-colors p-1.5 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <CiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(allocation)}
                          className="text-red-800 hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <MdOutlineDeleteForever className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">
                      No allocations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <AllocationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAllocations}
          allocationData={currentAllocation}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={allocationToDelete?.resource?.name || "this allocation"}
        />
      </div>
    </>
  );
};