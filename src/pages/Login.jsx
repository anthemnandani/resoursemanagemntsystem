import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

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
        "http://localhost:5000/api/admin/login",
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
    <div className="flex justify-center items-center min-h-screen flex-col gap-10">
      <div>
        <img src="/logo1.png" className="h-14 w-auto" alt="" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
               type="email"
               placeholder=" "
               value={email}
               required
               onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-4 pb-2 text-sm font-semibold text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="email"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold"
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
              className="peer w-full px-4 pt-4 pb-2 text-sm font-semibold text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="password"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white cursor-pointer py-2 rounded-4xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
          <div
            className="text-center flex items-center justify-center mt-2"
          >
            <button onClick={()=>navigate("/fogotpasword")}  className="text-blue-600 text-center flex items-center justify-center cursor-pointer">Forgot password?</button>
          </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnHover
      />
    </div>
  );
};
