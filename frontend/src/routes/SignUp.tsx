import { Navbar } from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Validation } from "../validation/Validation"; // external zod validation
import { EyeIcon } from "../icons/EyeIcon";
import { EyeHideIcon } from "../icons/EyeHideIcon";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameStatus, setUsernameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function clearError(field) {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }

  const isUsernameValid = (name) => /^[a-zA-Z0-9_]{3,30}$/.test(name);
  const isEmailValid = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  useEffect(() => {
    if (!username || !isUsernameValid(username)) {
      setUsernameStatus("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/check-username?username=${username}`
        );
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("error");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (!email || !isEmailValid(email)) {
      setEmailStatus("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/check-email?email=${email}`
        );
        setEmailStatus(res.data.available ? "available" : "taken");
      } catch {
        setEmailStatus("error");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  async function handleClick() {
    const result = Validation.safeParse({ username, email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(({ path, message }) => {
        fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    
    try {
      const response = await axios.post("http://localhost:3000/api/v1/signup", {
        username,
        email,
        password,
      });

      // Navigate to OTP page with props
      navigate("/otp", {
        state: {
          email: email,
          purpose: "signup",
          heading: "Verify Your Email",
          description: "Please enter the verification code sent to your email to complete your registration.",
          successMessage: "Email verified successfully! Welcome aboard!",
          redirectTo: "/login"
        }
      });

    } catch (err) {
      console.error("Signup failed:", err);
      const errorMessage = err?.response?.data?.message || "Cannot signup. Please try again.";
      alert(errorMessage);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200 relative z-10">
          <h4 className="md:text-5xl font-extrabold leading-tight mb-6">Sign Up</h4>

          <div className="flex flex-col relative max-w-xl mx-auto mb-6 gap-5">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError("username");
                }}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                placeholder="Username"
                className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">{errors.username}</p>
              )}
              {usernameFocused && usernameStatus === "available" && (
                <p className="text-green-600 text-sm mt-1">Username is available ✅</p>
              )}
              {usernameFocused && usernameStatus === "taken" && (
                <p className="text-red-600 text-sm mt-1">Username already taken ❌</p>
              )}
              {usernameFocused && usernameStatus === "error" && (
                <p className="text-red-400 text-sm mt-1">Error checking username</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="Email"
                className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
              {emailFocused && emailStatus === "available" && (
                <p className="text-green-600 text-sm mt-1">Email is available ✅</p>
              )}
              {emailFocused && emailStatus === "taken" && (
                <p className="text-red-600 text-sm mt-1">Email already in use ❌</p>
              )}
              {emailFocused && emailStatus === "error" && (
                <p className="text-red-400 text-sm mt-1">Error checking email</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                placeholder="Password"
                className="pl-12 pr-10 py-4 w-80 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <span
                className="absolute top-4 right-4 cursor-pointer text-gray-600 select-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowPassword((prev) => !prev);
                  }
                }}
              >
                {showPassword ? <EyeHideIcon /> : <EyeIcon />}
              </span>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={handleClick}
              className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl"
              disabled={emailStatus === "taken" || usernameStatus === "taken"}
            >
              Sign Up
            </button>
          </div>

          <div className="pt-6 text-gray-500">
            Already have an account?{" "}
            <span className="text-gray-900 font-semibold">
              <Link to="/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}