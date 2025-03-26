import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Employee } from "./pages/Employee";
import { Resourse } from "./pages/Resourse";
import { AllocatedResouses } from "./pages/AllocatedResourses";

function App() {
  return (
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />} /> 
          <Route path="/employee" element={<Employee />} />
          <Route path="/resourse" element={<Resourse />} />
          <Route path="/allocatedresourse" element={<AllocatedResouses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
  );
}

export default App;