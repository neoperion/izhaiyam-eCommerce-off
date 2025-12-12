// ---------------------- IMPORTS ----------------------
import { loginUser } from "../features/authSlice/login";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validateEmail } from "../utils/emailRegexValidation";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { fetchForgotPasswordClick } from "../features/authSlice/fetchForgotPasswordClick";
import { fetchResendEmailVerificationLink } from "../features/authSlice/resendEmailVerification";
import { FullpageSpinnerLoader } from "../components/loaders/spinnerIcon";
import { motion } from "framer-motion";

// Your chair photo
import chairImg from "../assets/images (1).jpg";

// ---------------------- COMPONENT ----------------------
export const LoginPage = () => {
  const [isPassword, setIsPassword] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const { isLoading } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forgot password
  const handleForgotPassword = () => {
    if (!loginDetails.email) {
      toast("Please enter your email address", { type: "info" });
      return;
    }
    if (!validateEmail(loginDetails.email)) {
      toast("Please enter a valid email", { type: "error" });
      return;
    }
    dispatch(fetchForgotPasswordClick(loginDetails.email));
  };

  // Resend verification mail
  const handleResendVerification = () => {
    if (!loginDetails.email) {
      toast("Please enter your email address", { type: "info" });
      return;
    }
    if (!validateEmail(loginDetails.email)) {
      toast("Please enter a valid email", { type: "error" });
      return;
    }
    dispatch(fetchResendEmailVerificationLink(loginDetails.email));
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginDetails.email)) {
      toast("Enter a valid email", { type: "error" });
      return;
    }

    const response = await dispatch(loginUser(loginDetails));

    if (response?.payload?.message) {
      navigate("/");
      setLoginDetails({ email: "", password: "" });
    }
  };

  // ---------------------- UI: Premium Modal ----------------------
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-[9999]">

      {/* Animated Modal Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40, filter: "blur(5px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-[680px] max-h-[82vh] 
                   overflow-y-auto rounded-[22px] bg-white/60 
                   backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.25)]
                   border border-white/20 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-[#93a267]"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* LEFT PANEL - IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="relative w-full md:w-[40%] h-[200px] md:h-auto"
        >
          <img
            src={chairImg}
            alt="Furniture"
            className="w-full h-full object-cover opacity-1"
          />

          {/* Soft beige gradient */}
          <div className="absolute inset-0 bg-gradient-to-br 
                          from-[#f1ecdf]/90 via-[#f1ecdf]/40 to-transparent">
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="absolute top-4 left-4 bg-[#93a267] 
                       text-white text-xs px-3 py-1 rounded-full shadow"
          >
            New Arrivals
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL - FORM */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-[60%] bg-[#f9f7f2] px-6 md:px-8 py-10"
        >
          {/* Branding */}
          <h3 className="tracking-[0.25em] text-[#3f5038] text-xs font-semibold mb-1">
            IZHAIYAM
          </h3>

          <h1 className="text-2xl font-bold text-[#3f5038]">Welcome Back</h1>
          <p className="text-gray-600 text-xs mt-1 mb-5">
            Sign in to continue shopping premium furniture.
          </p>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-xs text-gray-600 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={loginDetails.email}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
                className="w-full mt-1 h-11 rounded-lg border border-gray-300 px-4 text-sm 
                           bg-white/80 shadow-sm 
                           focus:ring-2 focus:ring-[#93a267] focus:border-[#93a267]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-600 font-medium">Password</label>
              <div className="relative">
                <input
                  type={isPassword ? "password" : "text"}
                  placeholder="********"
                  value={loginDetails.password}
                  onChange={(e) =>
                    setLoginDetails({ ...loginDetails, password: e.target.value })
                  }
                  className="w-full mt-1 h-11 rounded-lg border border-gray-300 px-4 text-sm 
                             bg-white/80 shadow-sm pr-12
                             focus:ring-2 focus:ring-[#93a267] focus:border-[#93a267]"
                  required
                />

                {/* Eye Icon */}
                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-600"
                  onClick={() => setIsPassword(!isPassword)}
                >
                  {isPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <span
                className="text-[#93a267] text-xs cursor-pointer hover:underline"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="h-11 bg-[#93a267] text-white rounded-lg font-semibold text-sm 
                         shadow-lg hover:shadow-[#93a26755] transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </motion.button>

            {/* Resend verification */}
            <p
              className="text-xs text-[#3f5038] text-center cursor-pointer hover:underline"
              onClick={handleResendVerification}
            >
              Resend email verification
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-[10px]">OR CONTINUE WITH</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 justify-center">
              <button className="border border-gray-300 rounded-lg bg-white h-10 px-4 text-xs shadow-sm">
                Google
              </button>
              <button className="border border-gray-300 rounded-lg bg-white h-10 px-4 text-xs shadow-sm">
                Apple
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs mt-3">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#93a267] font-medium hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>

      {isLoading && <FullpageSpinnerLoader />}
    </div>
  );
};
