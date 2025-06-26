import zod from "zod";

// Zod validation schema
const userSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email Address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  business: z.array(z.string()).optional(), // Optional array of strings
  image: z.array(z.string()).optional(), // Optional array of strings
});

module.exports = {
  userSchema,
};
