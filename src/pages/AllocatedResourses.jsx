import React, { useState, useEffect, useMemo } from "react";
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
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/allocations");
      setAllocations(response.data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize counts calculation for efficiency
  const counts = useMemo(() => {
    const allCount = allocations.length;
    const activeCount = allocations.filter((res) => res.status === "active").length;
    const returnedCount = allocations.filter((res) => res.status === "returned").length;
    return { all: allCount, active: activeCount, returned: returnedCount };
  }, [allocations]);

  const filteredAllocations = useMemo(() => {
    if (activeFilter === "all") return allocations;
    return allocations.filter((allocation) => allocation.status === activeFilter);
  }, [allocations, activeFilter]);

  const handleDeleteConfirm = async () => {
    if (!allocationToDelete) return;
    try {
      await axios.delete(`https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/return/${allocationToDelete._id}`);
      setAllocations((prev) => prev.filter((item) => item._id !== allocationToDelete._id));
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
            className="bg-[#013a63] text-white px-4 py-2 rounded flex items-center gap-2 relative group"
            onClick={() => {
              setCurrentAllocation(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <span className="absolute z-50 min-w-36 hidden group-hover:block bg-white border rounded-md shadow-md p-2 text-sm text-gray-700 -top-12 right-2">
              Allocate Resource
            </span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-4">
          {["all", "active", "returned"].map((filter) => (
            <button
              key={filter}
              className={`py-1 px-3 rounded ${activeFilter === filter ? "bg-[#013a63] text-white" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({counts[filter]})
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#013a63]"></div>
          </div>
        ) : (
          <div className="relative shadow-sm border border-gray-200 overflow-visible">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Resource</th>
                  <th className="px-6 py-3.5 font-medium">Employee</th>
                  <th className="px-6 py-3.5 font-medium">Allocation Date</th>
                  <th className="px-6 py-3.5 font-medium">Return Date</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAllocations.length > 0 ? (
                  filteredAllocations.map((allocation) => (
                    <tr key={allocation._id} className="bg-white hover:bg-gray-50 transition-colors">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allocation.returnDate ? new Date(allocation.returnDate).toLocaleDateString() : "Not returned yet"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          allocation.status === "active" ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {allocation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center space-x-3">
                        <button onClick={() => setCurrentAllocation(allocation)} className="text-[#013a63] hover:text-blue-700 p-1.5 rounded hover:bg-blue-50">
                          <CiEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setAllocationToDelete(allocation); setDeleteModalOpen(true); }} className="text-red-800 hover:text-red-700 p-1.5 rounded hover:bg-red-50">
                          <MdOutlineDeleteForever className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">No allocations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <AllocationFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAllocations} allocationData={currentAllocation} />
        <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={allocationToDelete?.resource?.name || "this allocation"} />
      </div>
    </>
  );
};