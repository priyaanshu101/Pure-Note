import express from "express";
const app = express();
app.use(express.json());
import jwt from "jsonwebtoken";
//@ts-ignore
import { UserModel, ContentModel } from "./db";
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
        const userExist = await UserModel.findOne({
            username: username,
            password: password
        })
        if(userExist){
            const token = jwt.sign({id: userExist._id}, JWT_PASSWORD as string);
            res.json({ token })
        }
    }
    catch(e){
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

app.post("/api/v1/brain/share",(req,res) => {
    
})

app.get("/api/v1/brain/:shareLink",(req,res) => {
    
})
app.listen(3000);