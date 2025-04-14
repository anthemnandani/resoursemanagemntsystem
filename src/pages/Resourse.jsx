import React, { useState, useEffect } from "react";
import axios from "axios";
import ResourceFormModal from "../components/ResourceFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { IoMdEye } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import Navbar from "../components/Navbar";
import ViewDetailsModal from "../components/ViewDetailsModal";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";

export const Resourse = () => {
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [ActiveFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [counts, setCounts] = useState({ all: 0, Available: 0, Allocated: 0 });
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [resourceToView, setResourceToView] = useState(null);

  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState("all");

  const fetchResources = async (status = null) => {
    setLoading(true);
    try {
      const params = {};
      if (status && status !== "all") params.status = status;

      const response = await axios.get("http://localhost:5000/api/resources", {
        params: {
          ...params,
          populate: "resourceType",
        },
      });

      if (status === null) {
        setFilteredResources(response.data.data);
      }
      const data = response.data.data;
      setResources(data);
      updateCounts(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/resourcestype"
      );
      setResourceTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching resource types:", error);
    }
  };

  useEffect(() => {
    const resourceTypeFromURL = searchParams.get("resourceType");
    if (resourceTypeFromURL && resourceTypes.length > 0) {
      // Try to find the matching resource type by name
      const match = resourceTypes.find(
        (type) => type.name.toLowerCase() === resourceTypeFromURL.toLowerCase()
      );
      if (match) {
        setSelectedResourceType(match._id);
      }
    }
  }, [searchParams, resourceTypes]);

  useEffect(() => {
    fetchResourceTypes();
  }, []);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (ActiveFilter === "all") {
      setFilteredResources(resources);
    } else {
      setFilteredResources(
        resources.filter((resource) => resource.status === ActiveFilter)
      );
    }
  }, [resources, ActiveFilter]);

  useEffect(() => {
    let updatedResources = [...resources];

    if (ActiveFilter !== "all") {
      updatedResources = updatedResources.filter(
        (resource) => resource.status === ActiveFilter
      );
    }

    if (selectedResourceType !== "all") {
      updatedResources = updatedResources.filter(
        (resource) => resource.resourceType?._id === selectedResourceType
      );
    }

    setFilteredResources(updatedResources);
  }, [resources, ActiveFilter, selectedResourceType]);

  const updateCounts = (data) => {
    const allCount = data.length;
    const AvailableCount = data.filter(
      (res) => res.status === "Available"
    ).length;
    const AllocatedCount = data.filter(
      (res) => res.status === "Allocated"
    ).length;
    setCounts({
      all: allCount,
      Available: AvailableCount,
      Allocated: AllocatedCount,
    });
  };

  const handleViewClick = (resource) => {
    setResourceToView(resource);
    setViewModalOpen(true);
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
        `http://localhost:5000/api/resources/deleteresourse/${resourceToDelete._id}`
      );
      fetchResources(ActiveFilter === "all" ? null : ActiveFilter);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 pt-14">
        <div className="flex justify-between items-center py-5">
          <div className="flex">
            <h2 className="text-2xl font-semibold text-center">Resources - </h2>
            <select
              className="bg-transparent border-b border-gray-200 text-gray-700 py-2 px-3 focus:outline-none focus:border-blue-500"
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
            >
              <option value="all">Resource Types</option>
              {resourceTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
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
                Add new resource
              </div>
            </div>
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div className="flex gap-4">
            <button
              className={`py-2 px-3 rounded ${
                ActiveFilter === "all" ? "bg-[#4361ee] text-white" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All ({counts.all})
            </button>
            <button
              className={`py-2 px-3 rounded ${
                ActiveFilter === "Available" ? "bg-[#4361ee] text-white" : ""
              }`}
              onClick={() => setActiveFilter("Available")}
            >
              Available ({counts.Available})
            </button>
            <button
              className={`py-2 px-3 rounded ${
                ActiveFilter === "Allocated" ? "bg-[#4361ee] text-white" : ""
              }`}
              onClick={() => setActiveFilter("Allocated")}
            >
              Allocated ({counts.Allocated})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4361ee]"></div>
          </div>
        ) : (
          <div className="relative shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Resource Type
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Total units
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Available units
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Warranty Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 font-medium text-center"
                  >
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
                      <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {resource.name.charAt(0).toUpperCase() +
                          resource.name.slice(1)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.resourceType?.name || "N/A"}
                      </td>
                      <td className="px-6 py-2 max-w-[200px] relative group">
                        <div className="truncate cursor-help">
                          {resource.description.charAt(0).toUpperCase() +
                            resource.description.slice(1) || "No description"}
                        </div>
                        <div className="absolute z-50 hidden group-hover:block min-w-[500px] max-w-[90vw] p-3 bg-white border border-gray-200 rounded-md shadow-lg top-full -translate-x-1/5 transform translate-y-[-50%]">
                          <div className="text-sm text-gray-700 max-h-[90vh] overflow-y-auto">
                            {resource.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.totalResourceCount}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.avaliableResourceCount}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.purchaseDate
                          ? new Date(resource.purchaseDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.warrantyExpiryDate
                          ? new Date(resource.warrantyExpiryDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resource.status === "Available"
                              ? "bg-green-50 text-green-800 hover:bg-green-100"
                              : resource.status === "Allocated"
                              ? "bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-50 text-red-800 hover:bg-red-100"
                          }`}
                        >
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 flex justify-center">
                        <button
                          onClick={() => handleViewClick(resource)}
                          className="text-black cursor-pointer hover:text-blue-900 transition-colors p-1.5 rounded relative"
                          title="View"
                        >
                          <IoMdEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(resource)}
                          className="text-[#4361ee] cursor-pointer hover:text-[#4361ee] transition-colors p-2 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <CiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource)}
                          className="text-red-800 cursor-pointer hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
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
                      className="px-6 py-2 text-center text-gray-500 italic"
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
          onSuccess={() =>
            fetchResources(ActiveFilter === "all" ? null : ActiveFilter)
          }
          resourceData={currentResource}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={resourceToDelete?.name || "this resource"}
        />

        <ViewDetailsModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={resourceToView}
          hiddenFields={[
            "__v",
            "_id",
            "createdAt",
            "isDeleted",
            "id",
            "updatedAt",
          ]}
          title="Resource Details"
        />
      </div>
      <Footer/>
    </>
  );
};
