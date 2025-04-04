import React, { useState, useEffect } from "react";
import axios from "axios";
import ResourceFormModal from "../components/ResourceTypeFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import Navbar from "../components/Navbar";

export const ResourseType = () => {
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype"
      );
      setResources(response.data.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (resource) => {
    setCurrentResource(resource);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype/${resourceToDelete._id}`
      );
      fetchResources();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 pt-14">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Resources Type</h2>
          <button
            className="bg-[#013a63] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
            onClick={() => {
              setCurrentResource(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <div className="absolute z-50 hidden group-hover:block min-w-[150px] max-w-[400px] p-2 bg-white border border-gray-200 rounded-md shadow-md -top-3 right-2 -translate-x-1/5 transform translate-y-[-80%]">
              <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                Add new resourse type
              </div>
            </div>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#013a63]"></div>
          </div>
        ) : (
            <div className="relative shadow-sm border border-gray-200 overflow-visible">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-medium">Resource Type</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Description</th>
                  <th scope="col" className="px-6 py-3.5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <tr key={resource._id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {resource.name}
                      </td>
                      <td className="px-6 py-4 max-w-[200px] relative group">
                        <div className="truncate cursor-help">
                          {resource.description || 'No description'}
                        </div>
                        {/* Floating tooltip */}
                        <div className="absolute z-50 hidden group-hover:block min-w-[200px] max-w-[400px] p-3 bg-white border border-gray-200 rounded-md shadow-lg -top-2 left-1/2 -translate-x-1/2 transform translate-y-[-100%]">
                          <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                            {resource.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex justify-center space-x-3">
                        <button
                          onClick={() => handleEditClick(resource)}
                          className="text-[#013a63] hover:text-[#013a63] cursor-pointer transition-colors p-1.5 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <CiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource)}
                          className="text-red-800 hover:text-red-700 cursor-pointer transition-colors p-1.5 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <MdOutlineDeleteForever className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500 italic">
                      No resources found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <ResourceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchResources}
          resourceData={currentResource}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={resourceToDelete?.name || "this resource"}
        />
      </div>
    </>
  );
};
