import React from 'react'
import { FaPlus } from "react-icons/fa6";
import Navbar from "../components/Navbar"

export const Resourse = () => {
  return (
     <>
        <Navbar/>
          <div className="container mx-auto my-6 p-4">
            <div className="flex justify-between items-cente py-4">
              <h2 className="text-2xl font-semibold text-center">Resourse List</h2>
              <button className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer">
              <FaPlus />
              </button>
            </div>
            <table className="w-full border-collapse border border-blue-900 shadow-md">
              <thead>
                <tr className="bg-blue-900 border-blue-900  text-white">
                  <th className="p-2 border"></th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">type</th>
                  <th className="p-2 border">description</th>
                  <th className="p-2 border">purchaseDate</th>
                  <th className="p-2 border">status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center border-b">
                  <td className="p-2 flex justify-center min-w-10 items-center">
                    1
                  </td>
                  <td className="p-2 border">inflix INBOOKi3</td>
                  <td className="p-2 border">Laptop</td>
                  <td className="p-2 border">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem, deserunt!</td>
                  <td className="p-2 border">01/01/2025</td>
                  <td className="p-2 border">available</td>
                  <td className="p-2 border">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2 cursor-pointer">
                      Edit
                    </button>
                    <button className="bg-red-700 text-white px-3 py-1 rounded cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="text-center border-b">
                  <td className="p-2 flex justify-center min-w-10 items-center">
                    1
                  </td>
                  <td className="p-2 border">inflix INBOOKi3</td>
                  <td className="p-2 border">Laptop</td>
                  <td className="p-2 border">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem, deserunt!</td>
                  <td className="p-2 border">01/01/2025</td>
                  <td className="p-2 border">available</td>
                  <td className="p-2 border">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2 cursor-pointer">
                      Edit
                    </button>
                    <button className="bg-red-700 text-white px-3 py-1 rounded cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="text-center border-b">
                  <td className="p-2 flex justify-center min-w-10 items-center">
                    1
                  </td>
                  <td className="p-2 border">inflix INBOOKi3</td>
                  <td className="p-2 border">Laptop</td>
                  <td className="p-2 border">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem, deserunt!</td>
                  <td className="p-2 border">01/01/2025</td>
                  <td className="p-2 border">available</td>
                  <td className="p-2 border">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2 cursor-pointer">
                      Edit
                    </button>
                    <button className="bg-red-700 text-white px-3 py-1 rounded cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="text-center border-b">
                  <td className="p-2 flex justify-center min-w-10 items-center">
                    1
                  </td>
                  <td className="p-2 border">inflix INBOOKi3</td>
                  <td className="p-2 border">Laptop</td>
                  <td className="p-2 border">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem, deserunt!</td>
                  <td className="p-2 border">01/01/2025</td>
                  <td className="p-2 border">available</td>
                  <td className="p-2 border">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2 cursor-pointer">
                      Edit
                    </button>
                    <button className="bg-red-700 text-white px-3 py-1 rounded cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
    
            {/* Customer Form Modal */}
            {/* {isModalOpen && (
            <CustomerModal
              closeModal={() => setIsModalOpen(false)}
              modalData={modalData}
              fetchCustomers={fetchCustomers}
            />
          )} */}
    
            {/* Delete Confirmation Modal */}
            {/* {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-4">
                  Are you sure you want to delete this customer?
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-red-700 text-white px-4 py-2 rounded"
                    // onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                    // onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )} */}
          </div>
        </>
  )
}
