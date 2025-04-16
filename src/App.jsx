import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Employee } from "./pages/Employee";
import { Resourse } from "./pages/Resourse";
import { AllocatedResouses } from "./pages/AllocatedResourses";
import { ResourseType } from "./pages/ResourceType";
import { ToastContainer } from 'react-toastify';
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
      <div className="h-screen w-screen overflow-y-scroll min-h-[90vh] animated-gradient poppins-regular">
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />} /> 
          <Route path="/employees" element={<Employee />} />
          <Route path="/resources" element={<Resourse />} />
          <Route path="/resourceType" element={<ResourseType />} />
          <Route path="/allocations" element={<AllocatedResouses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/fogotpasword" element={<ForgetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      </div>
  );
}

export default App;