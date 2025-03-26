import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 py-2 h-full w-full">
        <h2 className="text-3xl py-4">Dashboard</h2>
        <div className="flex gap-4">
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Employees
          </div>
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Resourses
          </div>
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Allocated Resourses
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
