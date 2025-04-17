import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion ({title})</h2>
        <p className="mb-2 text-gray-700">Are you sure you want to delete <span className='font-semibold'>{itemName}</span>?</p>
        <p className="mb-5 text-gray-700">If you delete <span className='font-semibold'>{itemName}</span>, then all data related to <span className='font-semibold'>{itemName}</span> will automatically be deleted.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;