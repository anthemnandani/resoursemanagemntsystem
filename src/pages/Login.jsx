import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    const token = Cookies.get("token");
    e.preventDefault();

    try {
      if (token) {
        navigate("/dashboard");
        return;
      }
      const { data } = await axios.post(
        "https://resoursemanagemntsystem-bksn.vercel.app/api/admin/login",
        {
          email,
          password,
        }
      );

      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
      Cookies.set("token", data.token, { expires: 1 });

      navigate("/");
    } catch (err) {
      console.log("Login error: ", err);
      toast.error(
        err.response?.data?.error || "failded to create please try again"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="bg-white px-8 py-10 rounded-lg shadow w-md flex flex-col justify-center items-center">
        <div className="mb-3">
          <img src="/logo1.png" className="h-14 w-auto" alt="" />
        </div>
        <p className="text-md text-gray-400 mb-6 text-center">
          Authorized entry for system administrators only.
        </p>

        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <div className="relative">
            <input
              type="email"
              placeholder=" "
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-5 pb-3 text-sm font-semibold text-gray-900 bg-transparent border-1 border-gray-200 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="email"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-semibold"
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder=" "
              value={password}
              required
              minLength={5}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-5 pb-3 text-sm font-semibold text-gray-900 bg-transparent border-1 border-gray-200 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="password"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-semibold"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white cursor-pointer py-3 rounded-3xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="flex items-center justify-between w-full py-2 mt-2">
          <div className="flex gap-1">
            <input type="checkbox" name="" id="" className="p-5" />
            <p className="text-gray-600">Remeber this Device</p>
          </div>
          <button
            onClick={() => navigate("/fogotpasword")}
            className="text-blue-600 font-semibold text-center flex items-center justify-center cursor-pointer"
          >
            Forgot Password ?
          </button>
        </div>
      </div>
    </div>
  );
};
