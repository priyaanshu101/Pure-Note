import mongoose, {model , Schema} from "mongoose";

import dotenv from "dotenv";
dotenv.config();
const mongodbURL= process.env.mongodbURL;

mongoose.connect(mongodbURL as string);
console.log("listen: 3000");
const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
})
export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})
export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: { type: String, unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
  brainName: {type: String, required: true}
})
export const LinkModel = model("Links", LinkSchema);

const emailVerificationSchema = new Schema({
  email:{ type: String, required: true},
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'forgot-password'], required: true },
  expiresAt: { type: Date, required: true },
}, 
{ timestamps: true,}
);
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerificationModel = model("EmailVerification", emailVerificationSchema);

