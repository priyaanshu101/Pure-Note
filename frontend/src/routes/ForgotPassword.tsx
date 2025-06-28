// Example of how to use the OTP page for forgot password

// In your ForgotPassword component:
const handleForgotPassword = async (email: string) => {
  try {
    await axios.post("http://localhost:3000/api/v1/forgot-password", { email });
    
    // Navigate to OTP page with forgot password props
    navigate("/otp", {
      state: {
        email: email,
        purpose: "forgot-password",
        heading: "Reset Your Password",
        description: "We've sent a verification code to your email. Enter it below to reset your password.",
        successMessage: "Code verified! You can now reset your password.",
        redirectTo: "/reset-password",
        backTo: "/forgot-password",
        backText: "Back to Forgot Password"
      }
    });
  } catch (err) {
    alert("Failed to send reset code. Please try again.");
  }
};

// In your Email Verification component:
const handleEmailVerification = async (email: string) => {
  try {
    await axios.post("http://localhost:3000/api/v1/send-verification", { email });
    
    // Navigate to OTP page with email verification props
    navigate("/otp", {
      state: {
        email: email,
        purpose: "email-verification",
        heading: "Verify Your Email",
        description: "Please verify your email address to continue using your account.",
        successMessage: "Email verified successfully!",
        redirectTo: "/dashboard",
        backTo: "/profile",
        backText: "Back to Profile"
      }
    });
  } catch (err) {
    alert("Failed to send verification code. Please try again.");
  }
};