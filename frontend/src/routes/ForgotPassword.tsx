import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./Navbar";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const isEmailValid = (mail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleForgotPassword = () => {
    if (!email.trim() || !isEmailValid(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    navigate("/otp", {
      state: {
        email,
        purpose: "forgot-password",
        heading: "Reset Your Password",
        description: "We've sent a verification code to your email. Enter it below to reset your password.",
        successMessage: "Code verified! You can now reset your password.",
        redirectTo: "/reset-password",
        backTo: "/forgot-password",
        backText: "Back to Forgot Password"
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200">
          <h4 className="md:text-5xl font-extrabold leading-tight mb-6">Forgot Password</h4>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-80 pl-4 pr-4 py-4 rounded-2xl bg-white/70 border shadow-md focus:ring-2 focus:ring-primary-500 mb-6"
          />
          <button
            onClick={handleForgotPassword}
            className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl"
          >
            Send Reset Code
          </button>
        </div>
      </div>
    </div>
  );
}
