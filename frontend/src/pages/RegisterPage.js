import { RegisterUser } from "../features/authSlice/register";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateEmail } from "../utils/emailRegexValidation";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FullpageSpinnerLoader } from "../components/loaders/spinnerIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const RegisterPage = () => {
  const [isInputValueInPassword, setIsInputValueInPassword] = useState(true);
  const [registerDetails, setRegisterDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const { isLoading } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(registerDetails.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const response = await dispatch(RegisterUser(registerDetails));

    if (!response.error) {
      toast.success("Account created successfully. Welcome aboard!");
      navigate("/login");
      setRegisterDetails({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
    } else {
      toast.error(response.payload || "Registration failed");
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-[#F9F8F4] py-10 px-4">
      <div className="w-full max-w-[480px] bg-white pt-12 pb-12 rounded-2xl shadow-sm border border-stone-100 px-8 md:px-10 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#93a267]"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-RobotoCondensed text-stone-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-stone-500 mt-2 text-sm">Join us for a premium experience</p>
        </div>

        <form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>
          {/* First Name */}
          <div className="w-full">
            <div className="relative w-full h-[56px] bg-stone-50 rounded-[12px] border border-stone-200 focus-within:border-[#93a267] focus-within:ring-1 focus-within:ring-[#93a267] transition-all duration-200">
              <input
                className="appearance-none absolute px-4 w-full h-full bg-transparent focus:outline-none text-stone-800 placeholder-transparent pt-3"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                required
                value={registerDetails.firstName}
                onChange={handleInputChange}
              />
              <label
                htmlFor="firstName"
                className="absolute left-4 top-1 text-[10px] text-[#93a267] font-semibold tracking-wider pointer-events-none transition-all duration-200 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400"
              >
                FIRST NAME
              </label>
            </div>
          </div>

          {/* Last Name */}
          <div className="w-full">
            <div className="relative w-full h-[56px] bg-stone-50 rounded-[12px] border border-stone-200 focus-within:border-[#93a267] focus-within:ring-1 focus-within:ring-[#93a267] transition-all duration-200">
              <input
                className="appearance-none absolute px-4 w-full h-full bg-transparent focus:outline-none text-stone-800 placeholder-transparent pt-3"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                required
                value={registerDetails.lastName}
                onChange={handleInputChange}
              />
              <label
                htmlFor="lastName"
                className="absolute left-4 top-1 text-[10px] text-[#93a267] font-semibold tracking-wider pointer-events-none transition-all duration-200"
              >
                LAST NAME
              </label>
            </div>
          </div>

          {/* Username */}
          <div className="w-full">
            <div className="relative w-full h-[56px] bg-stone-50 rounded-[12px] border border-stone-200 focus-within:border-[#93a267] focus-within:ring-1 focus-within:ring-[#93a267] transition-all duration-200">
              <input
                className="appearance-none absolute px-4 w-full h-full bg-transparent focus:outline-none text-stone-800 placeholder-transparent pt-3"
                type="text"
                id="username"
                name="username"
                minLength="3"
                maxLength="12"
                placeholder="Username"
                required
                value={registerDetails.username}
                onChange={handleInputChange}
              />
              <label
                htmlFor="username"
                className="absolute left-4 top-1 text-[10px] text-[#93a267] font-semibold tracking-wider pointer-events-none transition-all duration-200"
              >
                USERNAME
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <div className="relative w-full h-[56px] bg-stone-50 rounded-[12px] border border-stone-200 focus-within:border-[#93a267] focus-within:ring-1 focus-within:ring-[#93a267] transition-all duration-200">
              <input
                className="appearance-none absolute px-4 w-full h-full bg-transparent focus:outline-none text-stone-800 placeholder-transparent pt-3"
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                required
                value={registerDetails.email}
                onChange={handleInputChange}
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-1 text-[10px] text-[#93a267] font-semibold tracking-wider pointer-events-none transition-all duration-200"
              >
                EMAIL ADDRESS
              </label>
            </div>
          </div>

          {/* Password */}
          <div className="w-full">
            <div className="relative w-full h-[56px] bg-stone-50 rounded-[12px] border border-stone-200 focus-within:border-[#93a267] focus-within:ring-1 focus-within:ring-[#93a267] transition-all duration-200">
              <input
                className="appearance-none absolute px-4 w-full h-full bg-transparent focus:outline-none text-stone-800 placeholder-transparent pt-3"
                type={isInputValueInPassword ? "password" : "text"}
                id="password"
                name="password"
                minLength="8"
                placeholder="Password"
                required
                value={registerDetails.password}
                onChange={handleInputChange}
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-1 text-[10px] text-[#93a267] font-semibold tracking-wider pointer-events-none transition-all duration-200"
              >
                PASSWORD
              </label>
              <div
                className="absolute top-[1.1rem] right-4 cursor-pointer text-stone-400 hover:text-[#93a267] transition-colors"
                onClick={() => setIsInputValueInPassword(!isInputValueInPassword)}
              >
                {isInputValueInPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`h-[56px] mt-2 w-full rounded-[12px] text-white text-[16px] font-semibold tracking-wide shadow-md
              ${isLoading ? "bg-[#7a8854] cursor-not-allowed" : "bg-[#93a267] hover:bg-[#829158]"}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "CREATING ACCOUNT..." : "REGISTER"}
          </motion.button>

          <span className="text-center text-stone-500 text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-[#93a267] font-semibold hover:underline">
              Log in
            </Link>
          </span>
        </form>

        {isLoading && <FullpageSpinnerLoader />}
      </div>
    </section>
  );
};
