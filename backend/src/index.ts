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


app.post("/api/v1/send-otp", async (req:any, res:any) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await sendOTPEmail(email, otp, "signup");
    await EmailVerificationModel.create({
      email,
      otp,
      purpose: purpose,
      expiresAt
    });
    res.status(200).json({message:"OTP send successfully"});
  } catch (err) {
    console.error("Send signup OTP error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/verify-otp", async (req:any, res:any) => {
  const { email, otp, purpose } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const verification = await EmailVerificationModel.findOne({
      email,
      otp,
      purpose: purpose,
    });

    if (!verification) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (verification.expiresAt < new Date()) {
      await EmailVerificationModel.deleteOne({ _id: verification._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    await EmailVerificationModel.deleteOne({ _id: verification._id });

    return res.json({ message: "successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/signup", async (req:any, res:any) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "User created. Proceed to OTP verification." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/api/v1/forgot-password", async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    const user = await UserModel.findOne({email:email});
    console.log(user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// app.post("/api/v1/resend-signup-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     res.status(400).json({ message: "Email is required" });
//     return;
//   }

//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user || user.isVerified) {
//       res.status(404).json({ message: "User not found or already verified" });
//       return;
//     }
//     const otp = generateOtp();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     await EmailVerificationModel.findOneAndUpdate(
//       { userId: user._id, purpose: 'signup' },
//       { otp, expiresAt },
//       { upsert: true, new: true }
//     );

//     await sendOTPEmail(email, otp, 'signup');

//     res.json({ message: "Verification code resent" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });







app.post("/api/v1/login", async (req: any, res: any) => {
    const { credential, password } = req.body;
    
    try {
        const user = await UserModel.findOne({
            $or: [{ username: credential }, { email: credential }],
        });
        
        if (!user) return res.status(403).json({ message: "User do not exist" });
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
    
    const title = req.body.title;
    const link = req.body.link;
     const type = req.body.type;
    const description = req.body.description;
    await ContentModel.create({
        link,
        title,
        type,
        description,
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



import { loadEmbeddingModel, getEmbedding } from './embedding';

(async () => {
  await loadEmbeddingModel();
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
})();

app.get('/api/v1/search', async (req, res) => {
  try {
    const searchTerm = (req.query.q as string) || '';
    const limit = Number(req.query.limit) || 10;

    const embedding = await getEmbedding(searchTerm);

    // Step 1: Vector results
    const vectorResults = await ContentModel.aggregate([
      {
        $search: {
          index: "default",
          knnBeta: {
            vector: embedding,
            path: "embedding",
            k: 3
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]);

    // Step 2: Regex match for title and description
    const regexResults = await ContentModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } }
      ]
    })
    .limit(20);

    // Step 3: Merge and remove duplicates by _id
    const map = new Map();
    [...regexResults, ...vectorResults].forEach(item => {
      map.set(item._id.toString(), item);
    });

    const finalResults = Array.from(map.values()).slice(0, limit);
    res.json(finalResults);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});


app.listen(3000);