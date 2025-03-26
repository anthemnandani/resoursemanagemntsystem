import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerModal({ closeModal, modalData, fetchCustomers }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    status: "Gold",
    membershipID: "",
  });

  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    // Fetch membership options
    axios.get("https://customer-management-system-2ia8.vercel.app/api/memberships")
      .then((res) => setMemberships(res.data.memberships))
      .catch(console.error);

    // Populate form if in edit mode
    if (modalData) {
      setFormData(modalData);
    }
  }, [modalData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalData) {
        await axios.put(`https://customer-management-system-2ia8.vercel.app/api/customers/${modalData._id}`, formData);
      } else {
        await axios.post("https://customer-management-system-2ia8.vercel.app/api/customers", formData);
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90">
      <div className="bg-white shadow-lg p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{modalData ? "Edit" : "Add"} Customer</h2>
        <form onSubmit={handleSubmit}>
          <input className="w-full p-2 mb-2 border rounded" name="firstName" type="text" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
          <input className="w-full p-2 mb-2 border rounded" name="lastName" type="text" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
          <input className="w-full p-2 mb-2 border rounded" name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          <input className="w-full p-2 mb-2 border rounded" name="contactNumber" type="text" placeholder="Contact Number" required value={formData.contactNumber} onChange={handleChange} />

          <select className="w-full p-2 mb-2 border rounded" name="status" value={formData.status} onChange={handleChange}>
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
          </select>

          <select className="w-full p-2 mb-2 border rounded" name="membershipID" required value={formData.membershipID} onChange={handleChange}>
            <option value="">Select Membership</option>
            {memberships.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>

          <button className="w-full bg-blue-900 text-white p-2 rounded">{modalData ? "Update" : "Add"} Customer</button>
        </form>
        <button className="mt-2 w-full bg-gray-700 text-white p-2 rounded" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default CustomerModal;