import React, { useState, useEffect } from "react";
import axios from "axios";
import ResourceFormModal from "../components/ResourceTypeFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Navbar from "../components/Navbar";
import ViewDetailsModal from "../components/ViewDetailsModal";

import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import CustomPagination from "../components/CustomPagination";

export const ResourseType = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [resourceToView, setResourceToView] = useState(null);

  //paganation states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedResources = resources.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleUnitClick = (resourceTypeName) => {
    navigate(`/resources?resourceType=${encodeURIComponent(resourceTypeName)}`);
  };

  const handleViewClick = (resource) => {
    setResourceToView(resource);
    setViewModalOpen(true);
  };

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
      <div className="container mx-auto my-6 p-4 pt-20 min-h-[85vh]">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Resource Types</h2>
          <button
            className="bg-[#4361ee] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
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
          <div className="relative border border-gray-200 overflow-x-scroll bg-white rounded-2xl">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 font-bold text-xs">Resource Type</th>
                  <th className="px-6 py-5 font-bold text-xs">Description</th>
                  <th className="px-6 py-5 font-bold text-xs">
                    Resources Available
                  </th>
                  <th className="px-6 py-5 font-bold text-xs text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-60 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative border border-gray-200 overflow-x-scroll bg-white rounded-2xl">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Resource Type
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Resources Available
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 font-bold text-xs text-center"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {resources.length > 0 ? (
                  paginatedResources.map((resource) => (
                    <tr
                      key={resource._id}
                      className="bg-white hover:blue-50/10 transition-colors duration-150"
                    >
                      <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {resource.name}
                      </td>
                      <td className="px-6 py-2 max-w-[200px] relative group">
                        <div className="truncate cursor-help">
                          {resource.description || "No description"}
                        </div>
                        <div className="absolute z-50 hidden group-hover:block min-w-[500px] max-w-[90vw] p-3 bg-white border border-gray-200 rounded-md shadow-lg top-full -translate-x-1/5 transform translate-y-[-50%]">
                          <div className="text-sm text-gray-700 max-h-[90vh] overflow-y-auto">
                            {resource.description}
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-2 font-bold text-black cursor-pointer hover:underline"
                        onClick={() => handleUnitClick(resource.name)}
                        title="Click to view related resources"
                      >
                        {resource.resourceCount}
                      </td>

                      <td className="px-6 py-2 flex justify-start space-x-3">
                        <button
                          onClick={() => handleViewClick(resource)}
                          className="text-black cursor-pointer hover:text-blue-900 transition-colors p-2 rounded relative hover:bg-neutral-100"
                          title="View"
                        >
                          <IoMdEye className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleEditClick(resource)}
                          className="text-blue-700 hover:text-blue-600 cursor-pointer transition-colors p-1.5 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource)}
                          className="text-red-600 hover:text-red-500 cursor-pointer transition-colors p-1.5 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <MdDelete className="w-5 h-5"  />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-2 text-center text-gray-500 italic"
                    >
                      No resources found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <CustomPagination
              totalItems={resources.length}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
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
          title={"Resource Type"}
        />

        <ViewDetailsModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={resourceToView}
          hiddenFields={["__v", "_id", "createdAt", "updatedAt"]}
          title="Resource Type Details"
        />
      </div>
      <Footer />
    </>
  );
};
