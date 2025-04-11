import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post("http://localhost:5000/api/admin/fogotpassword", values)
        .then(() => {
          toast.success("Password reset email sent!");
          resetForm();
        })
        .catch((error) => {
          console.log("error: ", error);
          if (error.response?.status === 404) {
            toast.error("Email not found");
          } else {
            toast.error("Something went wrong. Please try again later.");
          }
        });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded-md p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Forgot Password
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-sm text-red-600 mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
        >
          Send Reset Link
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgetPassword;
