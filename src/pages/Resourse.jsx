import React, { useState, useEffect } from "react";
import axios from "axios";
import ResourceFormModal from "../components/ResourceFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import Navbar from "../components/Navbar";

export const Resourse = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Client-side filtering approach
  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredResources(resources);
    } else {
      setFilteredResources(
        resources.filter((resource) => resource.status === activeFilter)
      );
    }
  }, [resources, activeFilter]);

  /* 
  // API filtering approach (uncomment to use)
  useEffect(() => {
    fetchResources(activeFilter);
  }, [activeFilter]);
  */

  const fetchResources = async (status = null) => {
    setLoading(true);
    try {
      const params = {};
      if (status && status !== "all") params.status = status;

      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/resources", {
        params: {
          ...params,
          populate: "resourceType"
        }
      });
      setResources(response.data.data);
      
      // Only needed for client-side filtering
      if (status === null) {
        setFilteredResources(response.data.data);
      }
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
        `https://resoursemanagemntsystem-bksn.vercel.app/api/resources/deleteresourse/${resourceToDelete._id}`
      );
      fetchResources(activeFilter === "all" ? null : activeFilter);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 pt-10">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Resources</h2>
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 relative group"
            onClick={() => {
              setCurrentResource(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <div className="absolute z-50 hidden group-hover:block min-w-[150px] max-w-[400px] p-2 bg-white border border-gray-200 rounded-md shadow-md -top-3 right-2 -translate-x-1/5 transform translate-y-[-80%]">
              <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                Add new resource
              </div>
            </div>
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "all" ? "bg-blue-900 text-white" : ""
            } `}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "allocated" ? "bg-blue-900 text-white" : ""
            } `}
            onClick={() => setActiveFilter("allocated")}
          >
            Allocated
          </button>
          <button
            className={`py-1 px-3 rounded ${
              activeFilter === "available" ? "bg-blue-900 text-white" : ""
            } `}
            onClick={() => setActiveFilter("available")}
          >
            Available
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <div className="relative rounded shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Resource Name
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <tr
                      key={resource._id}
                      className="bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {resource.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.resourceType?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 max-w-[200px] relative group">
                        <div className="truncate cursor-help">
                          {resource.description || "No description"}
                        </div>
                        <div className="absolute z-50 hidden group-hover:block min-w-[200px] max-w-[800px] p-3 bg-white border border-gray-200 rounded-md shadow-lg -top-3 right-2 -translate-x-1/5 transform translate-y-[-90%]">
                          <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto">
                            {resource.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.purchaseDate
                          ? new Date(resource.purchaseDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            resource.status === "available"
                              ? "bg-green-50 text-green-800"
                              : resource.status === "allocated"
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center">
                        <button
                          onClick={() => handleEditClick(resource)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <CiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource)}
                          className="text-red-600 hover:text-red-900 transition-colors p-2 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <MdOutlineDeleteForever className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 italic"
                    >
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
          onSuccess={() => fetchResources(activeFilter === "all" ? null : activeFilter)}
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