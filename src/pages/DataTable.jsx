import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDescription, setHoveredDescription] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://resoursemanagemntsystem-bksn.vercel.app/api/resources');
        setData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const truncateDescription = (text) => {
    const words = text.split(' ');
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return text;
  };

  const handleDescriptionHover = (e, description) => {
    setHoveredDescription(description);
    setHoverPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setHoveredDescription(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Resource Management</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item._id.substring(0, 6)}...</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.resourceType?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'allocated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-help"
                    onMouseEnter={(e) => handleDescriptionHover(e, item.description)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {truncateDescription(item.description || 'No description')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="font-medium text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="font-medium text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tooltip for full description */}
      {hoveredDescription && (
        <div 
          className="fixed bg-white p-4 border border-gray-200 shadow-lg rounded max-w-md z-50 pointer-events-none"
          style={{
            left: `${hoverPosition.x + 15}px`,
            top: `${hoverPosition.y + 15}px`
          }}
        >
          <p className="text-sm text-gray-700">{hoveredDescription}</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;