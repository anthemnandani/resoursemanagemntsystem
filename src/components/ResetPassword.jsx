import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      const { newPassword } = values;
      const token = window.location.pathname.split("/").pop();

      axios
        .post(
          `https://resoursemanagemntsystem-bksn.vercel.app/api/admin/resetpassword/${token}`,
          {
            newPassword,
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Your link has expired"
          );
        });
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen flex-col gap-10">
      <div>
        <img src="/logo1.png" className="h-14 w-auto" alt="" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-2 rounded-lg w-full max-w-sm"
        >
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className="peer w-full mb-4 px-4 pt-4 pb-2 text-sm font-semibold text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />

            <label
              htmlFor="confirmPassword"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold"
            >
              New Password
            </label>
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="peer w-full mb-4 px-4 pt-4 pb-2 text-sm font-semibold text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-0 focus:border-blue-500"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-sm text-red-600 mb-1">
                  {formik.errors.confirmPassword}
                </p>
              )}

            <label
              htmlFor="newPassword"
              className="absolute -top-2 left-4 px-1 bg-gray-50 text-sm text-blue-500 font-semibold transform scale-100 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:font-semibold"
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full mb-3 bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
        <button
          type="submit"
          className="w-full bg-blue-50 text-blue-500 hover:text-white py-2 rounded-3xl hover:bg-blue-500 transition"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
