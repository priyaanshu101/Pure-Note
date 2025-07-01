import { Navbar } from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Validation } from "../validation/Validation";
import { EyeIcon } from "../icons/EyeIcon";
import { EyeHideIcon } from "../icons/EyeHideIcon";
import { API_BASE } from "../config/config";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameStatus, setUsernameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  function clearError(field:string) {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }

  const isUsernameValid = (name:string): boolean => /^[a-zA-Z0-9_]{3,30}$/.test(name);
  const isEmailValid = (mail:string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  useEffect(() => {
    if (!username || !isUsernameValid(username)) {
      setUsernameStatus("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get<any>(`${API_BASE}/check-username?username=${username}`);
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
        const res = await axios.get<any>(`${API_BASE}/check-email?email=${email}`);
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
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(({ path, message }) => {
        fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    navigate("/otp", {
      state: {
        username,
        email,
        password,
        purpose: "signup",
        heading: "Verify Your Email",
        description: "Please enter the verification code sent to your email.",
        successMessage: "Email verified successfully! Welcome aboard!",
        redirectTo: "/login",
        signupData: { username, email, password },
      },
    });
  }

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200">
          <h4 className="md:text-5xl font-extrabold leading-tight mb-6">Sign Up</h4>
          <div className="flex flex-col gap-5 mb-6">
            {/* Username Input */}
            <div>
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
                className="w-80 pl-12 pr-4 py-4 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500"
              />
              {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
              {usernameFocused && usernameStatus === "available" && <p className="text-green-600 text-sm">Username is available ✅</p>}
              {usernameFocused && usernameStatus === "taken" && <p className="text-red-600 text-sm">Username already taken ❌</p>}
              {usernameFocused && usernameStatus === "error" && <p className="text-red-400 text-sm">Error checking username</p>}
            </div>

            {/* Email Input */}
            <div>
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
                className="w-80 pl-12 pr-4 py-4 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              {emailFocused && emailStatus === "available" && <p className="text-green-600 text-sm">Email is available ✅</p>}
              {emailFocused && emailStatus === "taken" && <p className="text-red-600 text-sm">Email already in use ❌</p>}
              {emailFocused && emailStatus === "error" && <p className="text-red-400 text-sm">Error checking email</p>}
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
                className="pl-12 pr-10 py-4 w-80 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500"
              />
              <span
                className="absolute top-4 right-4 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeHideIcon size="md"/> : <EyeIcon size="md"/>}
              </span>
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
          </div>

          <button
            onClick={handleClick}
            className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl"
            disabled={emailStatus === "taken" || usernameStatus === "taken"}
          >
            Sign Up
          </button>

          <div className="pt-6 text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
