import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceFormModal from '../components/ResourceFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { FaPlus } from 'react-icons/fa6';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteForever } from 'react-icons/md';
import Navbar from '../components/Navbar';

export const Resourse = () => {
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('https://resoursemanagemntsystem-bksn.vercel.app/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
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
      await axios.delete(`https://resoursemanagemntsystem-bksn.vercel.app/api/resources/${resourceToDelete._id}`);
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
        <h2 className="text-2xl font-semibold text-center">Resource List</h2>
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

      <table className="w-full border-collapse border border-blue-900 shadow-md">
        <thead>
          <tr className="bg-blue-900 border-blue-900 text-white">
            <th className="p-2 border">Resource Name</th>
            <th className="p-2 border">images</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource._id} className="text-center border-b">
              <td className="p-2 border">{resource.name || 'N/A'}</td>
              <td className="p-2 border"></td>
              <td className="p-2 border">{resource.type}</td>
              <td className="p-2 border">{resource.description}</td>
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  resource.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : resource.status === 'allocated' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resource.status}
                </span>
              </td>
              <td className="p-2 border">
                <button 
                  className="bg-neutral-200 text-blue-500 text-2xl px-2 py-1 rounded mr-2 cursor-pointer"
                  onClick={() => handleEditClick(resource)}
                >
                  <CiEdit />
                </button>
                <button 
                  className="bg-neutral-200 text-red-700 text-2xl px-2 py-1 rounded cursor-pointer"
                  onClick={() => handleDeleteClick(resource)}
                >
                  <MdOutlineDeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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