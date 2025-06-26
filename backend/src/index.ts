import express from "express";
import crypto from "crypto";
const app = express();
app.use(express.json());
import jwt from "jsonwebtoken";
//@ts-ignore
import { UserModel, ContentModel, LinkModel } from "./db";
import { auth } from "./auth";
import cors from "cors";
import bcrypt from "bcrypt";
app.use(cors());
// const { userSchema } = require("../validation/ValidationSchema");

import dotenv from "dotenv";
dotenv.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD;

app.post("/api/v1/signup",async(req,res) => {
    
    const {username , password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    try{
        await UserModel.create({
            username: username,
            password: hashedPassword
        })
        res.json({
            message: "User Signed Up"
        })
    }
    catch(e){
        res.status(411).json({message:"User already exists"})
    }
})

app.post("/api/v1/login",async(req,res) => {
    const {username , password} = req.body;
        try{
            const user = await UserModel.findOne({
            username: username,
        });
        if(user){
            const passwordMatch = await bcrypt.compare(password, user.password as string);
            if (passwordMatch){
                const token = jwt.sign({id: user._id}, JWT_PASSWORD as string);
                res.json({
                    token: token,
                });
            }
        }
    }catch(e){
        res.status(403).json({message:"Incorrect Credentials"})
    }
})

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
      res.send("public");
    } else {
      res.send("private");
    }
  } catch (e) {
    res.status(500).send("private");
  }
});

app.post("/api/v1/brain/share", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  try {
    let link = await LinkModel.findOne({ userId });

    if (!link) {
      const hash = crypto.randomBytes(5).toString("hex");
      link = await LinkModel.create({ userId, hash });
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
    const allPublicLinks = await LinkModel.find();

    const allContent = [];

    for (const link of allPublicLinks) {
      const contents = await ContentModel.find({ userId: link.userId });
      allContent.push(...contents);
    }

    res.json({ contents: allContent });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch public content" });
  }
});


// app.get("/api/v1/brain/:shareLink", async (req, res) => {
//   const { shareLink } = req.params;

//   try {
//     const link = await LinkModel.findOne({ hash: shareLink });
//     if (!link) return res.status(404).json({ message: "Link not found" });

//     const contents = await ContentModel.find({ userId: link.userId });
//     res.json({ contents });
//   } catch (e) {
//     res.status(500).json({ message: "Failed to fetch shared brain" });
//   }
// });

app.listen(3000);