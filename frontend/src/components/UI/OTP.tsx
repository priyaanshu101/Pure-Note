import { Navbar } from "../../routes/Navbar";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import axios from "axios";

interface OtpPageState {
  email: string;
  purpose: "signup" | "forgot-password" | "email-verification";
  heading: string;
  description: string;
  successMessage: string;
  redirectTo: string;
  backTo?: string;
  backText?: string;
}

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OtpPageState;

  // Redirect if no state is passed
  useEffect(() => {
    if (!state?.email || !state?.purpose) {
      navigate("/signup");
    }
  }, [state, navigate]);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.select();
  };

  const getApiEndpoints = () => {
    switch (state.purpose) {
      case "signup":
        return {
          verify: "http://localhost:3000/api/v1/verify-signup-otp",
          resend: "http://localhost:3000/api/v1/resend-otp"
        };
      case "forgot-password":
        return {
          verify: "http://localhost:3000/api/v1/verify-forgot-password-otp",
          resend: "http://localhost:3000/api/v1/resend-forgot-password-otp"
        };
      case "email-verification":
        return {
          verify: "http://localhost:3000/api/v1/verify-email-otp",
          resend: "http://localhost:3000/api/v1/resend-email-otp"
        };
      default:
        return {
          verify: "http://localhost:3000/api/v1/verify-signup-otp",
          resend: "http://localhost:3000/api/v1/resend-otp"
        };
    }
  };

  const submitOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      alert("Please enter all OTP digits.");
      return;
    }

    setIsSubmitting(true);
    const endpoints = getApiEndpoints();

    try {
      await axios.post(endpoints.verify, {
        otp: fullOtp,
        email: state.email,
      });

      alert(state.successMessage);
      navigate(state.redirectTo);
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      const errorMessage = err?.response?.data?.message || "Invalid or expired OTP. Please try again.";
      alert(errorMessage);
      // Clear OTP on failure
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (isResending || resendTimer > 0) return;

    setIsResending(true);
    const endpoints = getApiEndpoints();

    try {
      await axios.post(endpoints.resend, {
        email: state.email,
      });
      
      alert("OTP resent successfully! Please check your email.");
      setOtp(new Array(6).fill("")); // Clear current OTP
      inputRefs.current[0]?.focus(); // Focus first input
      setResendCount(prev => prev + 1);
      
      // Set cooldown timer (30 seconds, increases with each resend)
      const cooldownTime = Math.min(30 + (resendCount * 15), 120); // Max 2 minutes
      setResendTimer(cooldownTime);
      
    } catch (err) {
      console.error("Resend OTP Failed:", err);
      const errorMessage = err?.response?.data?.message || "Failed to resend OTP. Please try again.";
      alert(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const canResend = !isResending && resendTimer === 0;
  const isOtpComplete = otp.every(digit => digit !== "");

  // Default values if state is incomplete
  const defaultState = {
    heading: "Verify Your Email",
    description: "Please enter the verification code sent to your email.",
    backTo: "/signup",
    backText: "Back to Sign Up",
    ...state
  };

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200 relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">{defaultState.heading}</h3>
              <p className="text-gray-600 mb-2">
                {defaultState.description}
              </p>
              <p className="text-gray-600">
                Code sent to{" "}
                <span className="font-semibold text-gray-800">{state?.email}</span>
              </p>
            </div>

            <div className="flex gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onClick={() => handleClick(index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <Button 
              variant="primary" 
              text={isSubmitting ? "Verifying..." : "Submit OTP"} 
              onClick={submitOtp}
              disabled={!isOtpComplete || isSubmitting}
            />

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </div>
              <button
                onClick={resendOtp}
                disabled={!canResend}
                className={`text-sm font-medium transition-colors ${
                  canResend
                    ? "text-primary-700 hover:text-primary-900 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {isResending 
                  ? "Resending..." 
                  : resendTimer > 0 
                  ? `Resend in ${resendTimer}s` 
                  : "Resend Code"
                }
              </button>
              
              {resendCount > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Resent {resendCount} time{resendCount > 1 ? 's' : ''}
                </div>
              )}
            </div>

            <Link
              to={defaultState.backTo}
              className="text-sm text-primary-600 hover:text-primary-800 hover:underline transition-colors"
            >
              ← {defaultState.backText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}