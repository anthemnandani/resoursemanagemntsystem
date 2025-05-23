import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
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
        .post(
          "https://resoursemanagemntsystem-bksn.vercel.app/api/admin/fogotpassword",
          values
        )
        .then(() => {
          toast.success("Password reset email sent!");
          resetForm();
        })
        .catch((error) => {
          console.log("error: ", error);
          if (error.response?.status === 404) {
            toast.error("No account found with this email");
          } else {
            toast.error("Something went wrong. Please try again later.");
          }
        });
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="bg-white px-8 py-10 rounded-lg shadow w-md flex flex-col justify-center items-center">
        <div className="mb-3">
          <img src="/logo1.png" className="h-14 w-auto" alt="" />
        </div>
        <p className="text-md text-gray-400 mb-6 text-center">
        Please enter the email address associated with your account and We will email you a link to reset your password.
        </p>{" "}
        <form
          onSubmit={formik.handleSubmit}
          className="mb-3 w-full"
        >
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="peer w-full mb-4 px-4 pt-5 pb-3 text-sm font-semibold text-gray-700 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="email"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-semibold"
            >
              Email
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 mb-3 text-white py-3 rounded-3xl hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
        <button
          type="submit"
          className="w-full bg-blue-50  text-blue-500 hover:text-white py-3 rounded-3xl hover:bg-blue-500 transition"
          onClick={() => navigate("/login")}
        >
          Back To Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
