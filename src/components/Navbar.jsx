import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between px-4 h-16 items-center bg-blue-800 text-white">
        <h1 className="text-xl">Resource Management System</h1>
        <ul className="flex gap-6">
          <li className="cursor-pointer" onClick={()=>navigate('/')}>Home</li>
          <li className="cursor-pointer" onClick={()=>navigate('/resourse')}>Resourses</li>
          <li className="cursor-pointer" onClick={()=>navigate('/employee')}>Employee</li>
          <li className="cursor-pointer" onClick={()=>navigate('/allocatedresourse')}>Allocated resourse</li>
        </ul>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-blue-900 font-semibold rounded-lg cursor-pointer">
            Logout
          </button>
          {/* <button className='px-4 py-2 bg-yellow-500 rounded-lg cursor-pointer'>Login</button> */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
