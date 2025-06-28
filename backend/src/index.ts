import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD;

import { Request, Response } from 'express';
import crypto from "crypto";

app.use(express.json());
import jwt from "jsonwebtoken";
//@ts-ignore
import { UserModel, ContentModel, LinkModel, EmailVerificationModel } from "./db";
import { auth } from "./auth";
import cors from "cors";
import bcrypt from "bcrypt";
app.use(cors());

app.get("/api/v1/check-username", async (req, res) => {
    const { username } = req.query;
    
    try {
        const user = await UserModel.findOne({ username });
        res.json({ available: !user });
    } catch (e) {
        res.status(500).json({ available: false, error: "Server error" });
    }
});
app.get("/api/v1/check-email", async (req, res) => {
    const { email } = req.query;
    
    try {
        const user = await UserModel.findOne({ email });
        res.json({ available: !user });
    } catch (e) {
        res.status(500).json({ available: false, error: "Server error" });
    }
});
import { sendOTPEmail, generateOtp } from "./email-service"; // Import the functions

app.post("/api/v1/signup", async (req, res) => {
    const { username, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds instead of 5 for better security
    
    try {
        // Create user first
        const user = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            isVerified: false
        });
        
        // Generate OTP and set expiration
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        
        // Save OTP verification record
        await EmailVerificationModel.create({
            userId: user._id, // Now user._id exists because we created the user above
            otp,
            purpose: 'signup',
            expiresAt,
        });
        
        // Send OTP email
        await sendOTPEmail(email, otp, 'signup');
        res.status(200).json({
            message: "OTP-verify"
        });
        
    } catch (e: any) {
        console.error("Signup error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/verify-signup-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    const verification = await EmailVerificationModel.findOne({
      userId: user._id,
      otp,
      purpose: 'signup',
    });

    if (!verification) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    user.isVerified = true;
    await user.save();
    await EmailVerificationModel.deleteOne({ _id: verification._id });

    res.json({ message: "Email verified successfully"});
  } catch (err) {
    console.error("Verify signup OTP error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/resend-signup-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user || user.isVerified) {
      res.status(404).json({ message: "User not found or already verified" });
      return;
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailVerificationModel.findOneAndUpdate(
      { userId: user._id, purpose: 'signup' },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp, 'signup');

    res.json({ message: "Verification code resent" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});







app.post("/api/v1/login", async (req: any, res: any) => {
    const { credential, password } = req.body;
    
    try {
        const user = await UserModel.findOne({
            $or: [{ username: credential }, { email: credential }],
        });
        
        if (!user) return res.status(403).json({ message: "User do not exist" });
        if (!user.isVerified) return res.status(403).json({ message: "User is not verified" });
        const passwordMatch = await bcrypt.compare(password, user.password as string);
        
        if (passwordMatch) {
            const token = jwt.sign({ id: user._id }, JWT_PASSWORD as string);
            res.json({
                token: token,
            });
        } else {
            res.status(403).json({ message: "Wrong Password" });
        }
    } catch (e) {
        res.status(500).json({ message: "server" });
    }
});

app.post("/api/v1/content", auth, async(req,res) => {
    //@ts-ignore
    const userId = req.userId;
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    await ContentModel.create({
        link,
        title,
        type,
        userId,
        tag:[]
    })
    res.json({message: "Content Added"})
})

app.get("/api/v1/contents", auth, async(req,res) => {
    //@ts-ignore
    const userId = req.userId;
    try{
        const response = await ContentModel.find({
            userId
        })
        res.json(response);
    }
    catch(e){
        console.error({message: "Error Fetching Content"})
        res.status(500).json({ error: "Failed to fetch content" });
    }
})

app.delete("/api/v1/deleteContent", auth, async(req,res) => {
    //@ts-ignore
    const userId = req.userId;
    const itemId = req.query.id;
    try{
       await ContentModel.deleteOne({ _id: itemId, userId });
       res.status(200).json({ message: "Content deleted successfully" });
    }
    
    catch(e){
        console.error({message: "Error Deleting Content"})
        res.status(500).json({ error: "Failed to delete content" });
    }
})

app.get("/api/v1/brain/public_OR_private", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  try {
    const link = await LinkModel.findOne({ userId });

    if (link) {
      res.json({ type: "public", hash: link.hash });
    } else {
      res.json({ type: "private", hash: "" });
    }
  } catch (e) {
    res.status(500).json({ type: "private", hash: "" });
  }
});


app.post("/api/v1/brain/share", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const brainName = req.body.brainName
  try {
    let link = await LinkModel.findOne({ userId });

    if (!link) {
      const hash = crypto.randomBytes(5).toString("hex");
      link = await LinkModel.create({ userId, hash, brainName });
    }

    res.json({ hash: link.hash });
  } catch (e) {
    res.status(500).json({ message: "Failed to share brain" });
  }
});

app.delete("/api/v1/brain/unshare", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  try {
    await LinkModel.deleteOne({ userId });
    res.json({ message: "Brain unshared successfully" });
  } catch (e) {
    res.status(500).json({ message: "Failed to unshare brain" });
  }
});

app.get("/api/v1/brain/public", async (req, res) => {
  try {
    const allPublicLinks = await LinkModel.find().lean();
    res.json(allPublicLinks);
  } catch (e) {
    console.error("Public fetch failed:", e);
    res.status(500).json({ message: "Failed to fetch public brains" });
  }
});


app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink.trim();
  const link = await LinkModel.findOne({ hash });
  if (!link) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  const content = await ContentModel.find({ userId: link.userId }).lean();
  res.json({
    content,
  });
});

app.listen(3000);