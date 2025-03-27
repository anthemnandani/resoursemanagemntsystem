import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceFormModal from '../components/ResourceTypeFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { FaPlus } from 'react-icons/fa6';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteForever } from 'react-icons/md';
import Navbar from '../components/Navbar';

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
      const response = await axios.get('http://localhost:5000/api/resourcestype');
      setResources(response.data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
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
      await axios.delete(`http://localhost:5000/api/resourcestype/${resourceToDelete._id}`);
      fetchResources();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="container mx-auto my-6 p-4">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-center">Resources</h2>
          <button 
            className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
            onClick={() => {
              setCurrentResource(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-blue-900 shadow-md">
              <thead>
                <tr className="bg-blue-900 border-blue-900 text-white">
                  <th className="p-2 border">Resource Type</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <tr key={resource._id} className="text-center border-b hover:bg-gray-50">
                      <td className="p-2 border">{resource.name}</td>
                      <td className="p-2 border">{resource.description}</td>
                      <td className="p-2 border">
                        <button 
                          className="bg-neutral-200 text-blue-500 text-2xl px-2 py-1 rounded mr-2 cursor-pointer hover:bg-blue-100"
                          onClick={() => handleEditClick(resource)}
                        >
                          <CiEdit />
                        </button>
                        <button 
                          className="bg-neutral-200 text-red-700 text-2xl px-2 py-1 rounded cursor-pointer hover:bg-red-100"
                          onClick={() => handleDeleteClick(resource)}
                        >
                          <MdOutlineDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
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
          itemName={resourceToDelete?.name || 'this resource'}
        />
      </div>
    </>
  );
};