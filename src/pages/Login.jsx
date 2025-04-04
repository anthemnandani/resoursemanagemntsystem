import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("https://resoursemanagemntsystem-bksn.vercel.app/api/admin/login", {
        email,
        password,
      });

      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
      Cookies.set("token", data.token, { expires: 1 });

      navigate("/dashboard");
    } catch (err) {
      console.log("Login error: ", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />

          <button
            type="submit"
            className="w-full bg-[#013a63] text-white cursor-pointer py-2 rounded-md hover:bg-blue-900 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};