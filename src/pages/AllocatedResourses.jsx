import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AllocationFormModal from "../components/AllocationFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { FaPlus } from "react-icons/fa6";
// import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Navbar from "../components/Navbar";
import ViewDetailsModal from "../components/ViewDetailsModal";
import { Footer } from "../components/Footer";
import { toast } from "react-toastify";
import { IoSearchSharp } from "react-icons/io5";
import CustomPagination from "../components/CustomPagination";
import { FaFilter } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import AllocationFilterModal from "../components/AllocationFilterModal";

export const AllocatedResouses = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ActiveFilter, setActiveFilter] = useState("all");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [resourceToView, setResourceToView] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  //paganation states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleViewClick = (resource) => {
    setResourceToView(resource);
    setViewModalOpen(true);
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/allocations");
      setAllocations(response.data.reverse());
    } catch (error) {
      console.error("Error fetching allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize counts calculation for efficiency
  const counts = useMemo(() => {
    const allCount = allocations.length;
    const ActiveCount = allocations.filter(
      (res) => res.status === "Active"
    ).length;
    const ReturnedCount = allocations.filter(
      (res) => res.status === "Returned"
    ).length;
    return { all: allCount, Active: ActiveCount, Returned: ReturnedCount };
  }, [allocations]);

  const filteredAllocations = useMemo(() => {
    let filtered = [...allocations];

    if (ActiveFilter !== "all") {
      filtered = filtered.filter(
        (allocation) => allocation.status === ActiveFilter
      );
    }

    if (appliedFilters) {
      const {
        allocationStartDate,
        allocationEndDate,
        returnStartDate,
        returnEndDate,
        employeeId,
        resourceId,
        resourceTypeId,
      } = appliedFilters;

      if (allocationStartDate) {
        filtered = filtered.filter(
          (a) => new Date(a.AllocatedDate) >= new Date(allocationStartDate)
        );
      }
      if (allocationEndDate) {
        filtered = filtered.filter(
          (a) => new Date(a.AllocatedDate) <= new Date(allocationEndDate)
        );
      }
      if (returnStartDate) {
        filtered = filtered.filter(
          (a) =>
            a.returnDate && new Date(a.returnDate) >= new Date(returnStartDate)
        );
      }
      if (returnEndDate) {
        filtered = filtered.filter(
          (a) =>
            a.returnDate && new Date(a.returnDate) <= new Date(returnEndDate)
        );
      }
      if (employeeId) {
        filtered = filtered.filter((a) => a.employee?._id === employeeId);
      }
      if (resourceId) {
        filtered = filtered.filter((a) => a.resource?._id === resourceId);
      }
      if (resourceTypeId) {
        filtered = filtered.filter(
          (a) => a.resource?.resourceType?._id === resourceTypeId
        );
      }
      if (appliedFilters?.status) {
        filtered = filtered.filter((a) => a.status === appliedFilters.status);
      }
    }

    if (searchQuery.trim() !== "") {
      const keyword = searchQuery.toLowerCase();
      filtered = filtered.filter((allocation) => {
        const employeeName = allocation?.employee?.name?.toLowerCase() || "";
        const resourceName = allocation?.resource?.name?.toLowerCase() || "";

        const dateObj = new Date(allocation?.AllocatedDate);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const allocationDate = `${day}/${month}/${year}`;

        return (
          employeeName.includes(keyword) ||
          resourceName.includes(keyword) ||
          allocationDate.includes(keyword)
        );
      });
    }

    return filtered;
  }, [allocations, ActiveFilter, searchQuery, appliedFilters]);

  const handleDeleteConfirm = async () => {
    if (!allocationToDelete) return;
    try {
      await axios.delete(
        `https://resoursemanagemntsystem-bksn.vercel.app/api/allocations/return/${allocationToDelete._id}`
      );
      setAllocations((prev) =>
        prev.filter((item) => item._id !== allocationToDelete._id)
      );
      await fetchAllocations();
      setDeleteModalOpen(false);
      toast.success("Resource Returned successfully");
    } catch (error) {
      console.error("Error deleting allocation:", error);
    }
  };

  useEffect(() => {
    // Whenever activeFilter changes, fetch fresh data
    fetchAllocations();
  }, [ActiveFilter]);

  //paganation allocation function
  const paginatedAllocations = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAllocations.slice(startIndex, endIndex);
  }, [filteredAllocations, currentPage, rowsPerPage]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Employee",
      "Resource",
      "Resource Type",
      "Allocation Date",
      "Return Date",
      "Status",
    ];

    const tableRows = [];

    filteredAllocations.forEach((allocation) => {
      const employee = allocation?.employee?.name || "N/A";
      const resource = allocation?.resource?.name || "N/A";
      const resourceType = allocation?.resource?.resourceType?.name || "N/A"; // ✅ Safely get resource type

      const allocationDate = new Date(
        allocation?.AllocatedDate
      ).toLocaleDateString("en-GB");
      const returnDate = allocation?.returnDate
        ? new Date(allocation.returnDate).toLocaleDateString("en-GB")
        : "N/A";
      const status = allocation.status || "N/A";

      const rowData = [
        employee,
        resource,
        resourceType,
        allocationDate,
        returnDate,
        status,
      ];
      tableRows.push(rowData);
    });

    doc.text("Filtered Allocated Resources", 14, 15);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("allocated-resources.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 p-4 pt-20 min-h-[85vh]">
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-semibold text-center">
            Allocated Resources
          </h2>
          <button
            className="bg-[#4361ee] text-white px-4 py-2 rounded flex items-center gap-2 relative group"
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

        <div className="flex justify-between mt-8 mb-4">
          {/* Filter Buttons */}
          <div className="flex gap-4">
            {["all", "Active", "Returned"].map((filter) => (
              <button
                key={filter}
                className={`py-1 px-3 rounded ${
                  ActiveFilter === filter ? "bg-[#4361ee] text-white" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} (
                {counts[filter]})
              </button>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-2xl flex items-center justify-center border border-gray-300 rounded p-2">
              <IoSearchSharp className="mr-2" />
              <input
                type="search"
                className="text-base w-full focus:outline-none placeholder:text-sm"
                placeholder="Search allocations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div
              className="bg-[#4361ee] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </div>
            <div
              className=" px-3 py-2 flex items-center gap-2 bg-[#4361ee] text-white rounded cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FaFilter /> Filter
            </div>
          </div>
        </div>

        {loading ? (
          <div className="relative border border-gray-200 overflow-x-scroll bg-white rounded-2xl">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 font-bold text-xs">Resource</th>
                  <th className="px-6 py-5 font-bold text-xs">Employee</th>
                  <th className="px-6 py-5 font-bold text-xs">
                    Allocation Date
                  </th>
                  <th className="px-6 py-5 font-bold text-xs">Return Date</th>
                  <th className="px-6 py-5 font-bold text-xs">Status</th>
                  <th className="px-6 py-5 font-bold text-xs text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
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
                  <th className="px-6 py-5 font-bold text-xs">Resource</th>
                  <th className="px-6 py-5 font-bold text-xs">Employee</th>
                  <th className="px-6 py-5 font-bold text-xs">
                    Allocation Date
                  </th>
                  <th className="px-6 py-5 font-bold text-xs">Return Date</th>
                  <th className="px-6 py-5 font-bold text-xs">Status</th>
                  <th className="px-6 py-5 font-bold text-xs text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.length > 0 ? (
                  paginatedAllocations.map((allocation) => (
                    <tr key={allocation._id} className="bg-white">
                      <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {allocation.resource?.name.charAt(0).toUpperCase() +
                          allocation.resource?.name.slice(1) || "N/A"}
                      </td>
                      <td className="px-6 py-2">
                        <div className="font-medium">
                          {allocation.employee?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {allocation.employee?.position || ""}
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {new Date(allocation.AllocatedDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {allocation.returnDate
                          ? new Date(allocation.returnDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Not Returned yet"}
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            allocation.status === "Active"
                              ? "bg-green-100 hover:bg-green-50 text-green-600"
                              : "bg-yellow-100 hover:bg-yellow-50 text-yellow-500"
                          }`}
                        >
                          {allocation.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 flex justify-center space-x-3">
                        <button
                          onClick={() => handleViewClick(allocation)}
                          className="text-black cursor-pointer hover:bg-neutral-100 hover:text-blue-900 transition-colors p-2 rounded relative"
                          title="View"
                        >
                          <IoMdEye className="w-5 h-5" />
                        </button>
                        {/* <button
                          onClick={() => setCurrentAllocation(allocation)}
                          className="text-blue-900 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button> */}
                        <button
                          onClick={() => {
                            setAllocationToDelete(allocation);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-500 p-1.5 rounded hover:bg-red-50"
                          title="Return Resource"
                        >
                          <MdDelete className="w-5 h-5" />
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
                      No allocations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <CustomPagination
              totalItems={filteredAllocations.length}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        <AllocationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAllocations}
          allocationData={currentAllocation}
        />

        <AllocationFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={allocationToDelete?.resource?.name || "this allocation"}
          title={"Allocated Resource"}
        />

        <ViewDetailsModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={resourceToView}
          hiddenFields={[
            "__v",
            "_id",
            "createdAt",
            "images",
            "isDeleted",
            "id",
            "updatedAt",
          ]}
          title="Allocated Resource Details"
        />
      </div>
      <Footer />
    </>
  );
};
