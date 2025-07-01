import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Validation } from "../validation/Validation";

import axios from "axios";
import { API_BASE } from "../config/config";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill both fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    const result = Validation.shape.password.safeParse(password);
    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    try {
      await axios.post(`${API_BASE}/forgot-password`, {
        email,
        password,
      });
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password.");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border">
          <h4 className="text-4xl font-bold mb-6">Reset Your Password</h4>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-80 pl-4 pr-4 py-4 mb-4 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-80 pl-4 pr-4 py-4 mb-6 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleReset}
            className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
