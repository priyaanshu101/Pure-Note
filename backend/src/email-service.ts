import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const { USER, PASS, FROM_EMAIL } = process.env;

if (!USER || !PASS || !FROM_EMAIL) {
  throw new Error("Missing one of USER, PASS or FROM_EMAIL in your .env file");
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER,
    pass: PASS,
  },
});

export async function sendOTPEmail(
  email: string, 
  otp: string, 
  purpose: 'signup' | 'reset-password' | string
): Promise<void> {
  try {
    // Customize email content based on purpose
    const getEmailContent = (purpose: string, otp: string) => {
      switch (purpose) {
        case 'signup':
          return {
            subject: 'Verify Your Account - OTP Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome! Please Verify Your Account</h2>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                    Thank you for signing up! To complete your registration, please use the verification code below:
                  </p>
                  
                  <div style="background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </h1>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                    <strong>Important:</strong> This code expires in 5 minutes for your security. If you didn't request this verification, please ignore this email.
                  </p>
                  
                  <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                      This is an automated message, please do not reply to this email.
                    </p>
                  </div>
                </div>
              </div>
            `,
            text: `
              Welcome! Please verify your account.
              
              Your verification code is: ${otp}
              
              This code expires in 5 minutes.
              
              If you didn't request this verification, please ignore this email.
            `
          };
        
        case 'reset-password':
          return {
            subject: 'Password Reset - OTP Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h2>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                    We received a request to reset your password. Use the code below to proceed:
                  </p>
                  
                  <div style="background-color: #fff3cd; border: 2px dashed #ffc107; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h1 style="color: #856404; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </h1>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                    <strong>Security Notice:</strong> This code expires in 5 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                  </p>
                  
                  <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                      This is an automated message, please do not reply to this email.
                    </p>
                  </div>
                </div>
              </div>
            `,
            text: `
              Password Reset Request
              
              Your reset code is: ${otp}
              
              This code expires in 5 minutes.
              
              If you didn't request a password reset, please ignore this email.
            `
          };
        
        default:
          return {
            subject: 'Your Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Your Verification Code</h2>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>This code expires in 5 minutes.</p>
              </div>
            `,
            text: `Your verification code is: ${otp}\n\nThis code expires in 5 minutes.`
          };
      }
    };

    const emailContent = getEmailContent(purpose, otp);

    const mailOptions = {
      from: `PureNote <${FROM_EMAIL}>`, // Simple format that works
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    throw new Error('Failed to send verification email');
  }
}

// Optional: Function to verify transporter configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email transporter is ready to send emails');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
}