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
    isVerified: { type: Boolean, default: false }
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
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'reset'], required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, 
{ timestamps: true,}
);
export const EmailVerificationModel = model("EmailVerification", emailVerificationSchema);


