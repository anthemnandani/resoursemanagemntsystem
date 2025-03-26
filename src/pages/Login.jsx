import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://resoursemanagemntsystem-bksn.vercel.app/api/admin/login", formData);
            
            // Store user data and token in cookies
            Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
            Cookies.set("token", response.data.token, { expires: 1 });
            
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.error || "Login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <span 
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};