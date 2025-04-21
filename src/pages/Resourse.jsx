import React, { useState, useEffect } from "react";
import axios from "axios";
import ResourceFormModal from "../components/ResourceFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Navbar from "../components/Navbar";
import ViewDetailsModal from "../components/ViewDetailsModal";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { SiTicktick } from "react-icons/si";
import AllocationFormModal from "../components/AllocationFormModal";
import CustomPagination from "../components/CustomPagination";

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

  const [openTooltip, setOpenTooltip] = useState(null);
  const [resourceAllocations, setResourceAllocations] = useState({});

  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState("all");

  //for employee resource allocation
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState("");

  //paganation state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchResources = async (status = null) => {
    setLoading(true);
    try {
      const params = {};
      if (status && status !== "all") params.status = status;

      const response = await axios.get(
        "https://resoursemanagemntsystem-bksn.vercel.app/api/resources",
        {
          params: {
            ...params,
            populate: "resourceType",
          },
        }
      );

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
        "https://resoursemanagemntsystem-bksn.vercel.app/api/resourcestype"
      );
      setResourceTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching resource types:", error);
    }
  };

  const fetchAllocationsForResource = async (resourceId) => {
    try {
      const response = await axios.get(
        `https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/resource/${resourceId}`
      );
      setResourceAllocations((prev) => ({
        ...prev,
        [resourceId]: response.data.allocations,
      }));
    } catch (error) {
      console.error("Error fetching resource allocations:", error);
    }
  };

  const handleTooltipClick = (resourceId) => {
    if (openTooltip === resourceId) {
      setOpenTooltip(null);
    } else {
      fetchAllocationsForResource(resourceId);
      setOpenTooltip(resourceId);
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
        `https://resoursemanagemntsystem-bksn.vercel.app/api/resources/deleteresourse/${resourceToDelete._id}`
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
      <div className="container mx-auto my-6 p-4 pt-20 min-h-[85vh]">
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
          <div className="relative border border-gray-200 overflow-x-scroll bg-white rounded-2xl">
            <table className="w-full text-sm text-left text-gray-700 animate-pulse">
              <thead className="text-xs text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 font-bold text-xs">Resource</th>
                  <th className="px-6 py-5 font-bold text-xs">Description</th>
                  <th className="px-6 py-5 font-bold text-xs">
                    Total Resources
                  </th>
                  <th className="px-6 py-5 font-bold text-xs">
                    Available Resources
                  </th>
                  <th className="px-6 py-5 font-bold text-xs">Purchase Date</th>
                  <th className="px-6 py-5 font-bold text-xs">Status</th>
                  <th className="px-6 py-5 font-bold text-xs text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
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
                    Resource
                  </th>
                  {/* <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Resource Type
                  </th> */}
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Available
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Allocated
                  </th>
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Purchase Date
                  </th>
                  {/* <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Warranty Expiry Date
                  </th> */}
                  <th scope="col" className="px-6 py-5 font-bold text-xs">
                    Status
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
                {paginatedResources.length > 0 ? (
                  paginatedResources.map((resource) => (
                    <tr key={resource._id} className="bg-white">
                      <td className="px-6 py-2 min-w-[200px]">
                        <div className="font-semibold">
                          {resource.name.charAt(0).toUpperCase() +
                            resource.name.slice(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resource.resourceType?.name || "N/A"}
                        </div>
                      </td>
                      {/* <td className="px-6 py-2 whitespace-nowrap">
                        {resource.resourceType?.name || "N/A"}
                      </td> */}
                      <td className="px-6 py-2 max-w-[250px] relative group">
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
                      <td className="px-4 py-2 flex justify-start max-w-[100px]">
                        <div className="relative inline-block tooltip-container">
                          <button
                            className="text-black cursor-pointer font-bold hover:text-blue-950 hover:bg-neutral-100 transition-colors p-1.5 rounded relative"
                            title="Click to see all employees this resource is allocated to"
                            onClick={() => handleTooltipClick(resource._id)}
                          >
                            {resource.allocatedResourceCount}
                          </button>

                          {/* Tooltip */}
                          {openTooltip === resource._id &&
                            resourceAllocations[resource._id]?.length > 0 && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white shadow-lg rounded p-2 text-sm border z-50">
                                <div className="text-md mb-3 font-semibold">
                                  Allocated to Employees
                                </div>
                                <hr />
                                <div>
                                  {resourceAllocations[resource._id].map(
                                    (alloc, index) => (
                                      <div
                                        key={index}
                                        className="border-b pb-1 mb-1 last:border-none"
                                      >
                                        <p className="font-semibold">
                                          {alloc.employeeName}
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
                      <td className="px-6 py-2 whitespace-nowrap">
                        {resource.purchaseDate
                          ? new Date(resource.purchaseDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                      {/* <td className="px-6 py-2 whitespace-nowrap">
                        {resource.warrantyExpiryDate
                          ? new Date(
                              resource.warrantyExpiryDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td> */}
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resource.status === "Available"
                              ? "hover:bg-green-50 text-green-800 bg-green-100"
                              : resource.status === "Allocated"
                              ? "hover:bg-yellow-50 text-yellow-800 bg-yellow-100"
                              : "hover:bg-red-50 text-red-800 bg-red-100"
                          }`}
                        >
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 flex items-center justify-center">
                        <button
                          onClick={() => handleViewClick(resource)}
                          className="text-black cursor-pointer hover:bg-neutral-100 hover:text-blue-900 transition-colors p-2 rounded relative"
                          title="View"
                        >
                          <IoMdEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(resource)}
                          className="text-blue-700 cursor-pointer hover:text-600 transition-colors p-2 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource)}
                          className="text-red-600 cursor-pointer hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <MdDelete className="w-5 h-5"  />
                        </button>
                        <div className="relative group">
                          <button
                            className="text-black cursor-pointer transition-colors p-1.5 rounded"
                            onClick={() => {
                              setCurrentResourceId(resource._id); // assuming 'resource' is the current resource in the map
                              setIsAllocationModalOpen(true);
                            }}
                          >
                            <SiTicktick className="w-4 h-4" />
                          </button>
                          <div className="absolute z-50 hidden group-hover:block rounded-md shadow-md -top-10 right-1 -translate-x-1/5 transform translate-y-[-0%]">
                            <button className="text-sm text-blue-950 px-4 py-2 bg-neutral-50 min-h-10 min-w-48 overflow-y-auto">
                              Allocate this resource to an employee
                            </button>
                          </div>
                        </div>
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
            <CustomPagination
              totalItems={filteredResources.length}
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
          onSuccess={() =>
            fetchResources(ActiveFilter === "all" ? null : ActiveFilter)
          }
          resourceData={currentResource}
        />

        <AllocationFormModal
          isOpen={isAllocationModalOpen}
          onClose={() => setIsAllocationModalOpen(false)}
          onSuccess={() => {
            fetchResources();
            setIsAllocationModalOpen(false);
          }}
          selectedResourceId={currentResourceId}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={resourceToDelete?.name || "this resource"}
          title={"Resource"}
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
      <Footer />
    </>
  );
};
