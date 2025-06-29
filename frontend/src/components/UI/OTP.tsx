import { Navbar } from "../../routes/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "./Button";

interface OtpPageState {
  username: string;
  email: string;
  password: string;
  purpose: string;
  heading: string;
  description: string;
  successMessage: string;
  redirectTo: string;
}

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OtpPageState;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSentOtp = useRef(false);

  useEffect(() => {
    if (!state?.email) {
      navigate("/signup");
      return;
    }
    if (!hasSentOtp.current) {
      hasSentOtp.current = true;
      sendOtp();
    }
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/send-otp", {
        email: state.email,
        purpose: state.purpose,
      });
      alert("OTP sent to your email.");
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP.");
    }
  };

  const submitOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      alert("Please enter all OTP digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:3000/api/v1/verify-otp", {
        otp: fullOtp,
        email: state.email,
        purpose: state.purpose,
      });

      if (state.purpose === "signup") {
        await axios.post("http://localhost:3000/api/v1/signup", {
          username: state.username,
          email: state.email,
          password: state.password,
        });
        alert(state.successMessage);
        navigate(state.redirectTo);
      } else {
        navigate("/reset-password", { state: { email: state.email } });
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert(err?.response?.data?.message || "Invalid or expired OTP.");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 px-6 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border">
          <h3 className="text-4xl font-bold mb-2">{state.heading}</h3>
          <p className="text-gray-600">{state.description}</p>
          <p className="text-sm text-gray-600">
            Code sent to <span className="font-semibold">{state.email}</span>
          </p>

          <div className="flex gap-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[index] = e.target.value;
                  setOtp(newOtp);
                  if (e.target.value && index < 5) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
            ))}
          </div>

          <Button
            variant="primary"
            text={isSubmitting ? "Verifying..." : "Submit OTP"}
            onClick={submitOtp}
            disabled={isSubmitting || otp.some((d) => !d)}
          />
        </div>
      </div>
    </div>
  );
}
