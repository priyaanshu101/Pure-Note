"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const crypto_1 = __importDefault(require("crypto"));
app.use(express_1.default.json());
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//@ts-ignore
const db_1 = require("./db");
const auth_1 = require("./auth");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
app.use((0, cors_1.default)());
app.get("/api/v1/check-username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.query;
    try {
        const user = yield db_1.UserModel.findOne({ username });
        res.json({ available: !user });
    }
    catch (e) {
        res.status(500).json({ available: false, error: "Server error" });
    }
}));
app.get("/api/v1/check-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    try {
        const user = yield db_1.UserModel.findOne({ email });
        res.json({ available: !user });
    }
    catch (e) {
        res.status(500).json({ available: false, error: "Server error" });
    }
}));
const email_service_1 = require("./email-service"); // Import the functions
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Use 10 rounds instead of 5 for better security
    try {
        // Create user first
        const user = yield db_1.UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            isVerified: false
        });
        // Generate OTP and set expiration
        const otp = (0, email_service_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        // Save OTP verification record
        yield db_1.EmailVerificationModel.create({
            userId: user._id, // Now user._id exists because we created the user above
            otp,
            purpose: 'signup',
            expiresAt,
        });
        // Send OTP email
        yield (0, email_service_1.sendOTPEmail)(email, otp, 'signup');
        res.status(200).json({
            message: "OTP-verify"
        });
    }
    catch (e) {
        console.error("Signup error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/api/v1/verify-signup-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400).json({ message: "Email and OTP are required" });
        return;
    }
    try {
        const user = yield db_1.UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: "User already verified" });
            return;
        }
        const verification = yield db_1.EmailVerificationModel.findOne({
            userId: user._id,
            otp,
            purpose: 'signup',
        });
        if (!verification) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        user.isVerified = true;
        yield user.save();
        yield db_1.EmailVerificationModel.deleteOne({ _id: verification._id });
        res.json({ message: "Email verified successfully" });
    }
    catch (err) {
        console.error("Verify signup OTP error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/resend-signup-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    try {
        const user = yield db_1.UserModel.findOne({ email });
        if (!user || user.isVerified) {
            res.status(404).json({ message: "User not found or already verified" });
            return;
        }
        const otp = (0, email_service_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        yield db_1.EmailVerificationModel.findOneAndUpdate({ userId: user._id, purpose: 'signup' }, { otp, expiresAt }, { upsert: true, new: true });
        yield (0, email_service_1.sendOTPEmail)(email, otp, 'signup');
        res.json({ message: "Verification code resent" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = req.body;
    try {
        const user = yield db_1.UserModel.findOne({
            $or: [{ username: credential }, { email: credential }],
        });
        if (!user)
            return res.status(403).json({ message: "User do not exist" });
        if (!user.isVerified)
            return res.status(403).json({ message: "User is not verified" });
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (passwordMatch) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_PASSWORD);
            res.json({
                token: token,
            });
        }
        else {
            res.status(403).json({ message: "Wrong Password" });
        }
    }
    catch (e) {
        res.status(500).json({ message: "server" });
    }
}));
app.post("/api/v1/content", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    yield db_1.ContentModel.create({
        link,
        title,
        type,
        userId,
        tag: []
    });
    res.json({ message: "Content Added" });
}));
app.get("/api/v1/contents", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const response = yield db_1.ContentModel.find({
            userId
        });
        res.json(response);
    }
    catch (e) {
        console.error({ message: "Error Fetching Content" });
        res.status(500).json({ error: "Failed to fetch content" });
    }
}));
app.delete("/api/v1/deleteContent", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const itemId = req.query.id;
    try {
        yield db_1.ContentModel.deleteOne({ _id: itemId, userId });
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (e) {
        console.error({ message: "Error Deleting Content" });
        res.status(500).json({ error: "Failed to delete content" });
    }
}));
app.get("/api/v1/brain/public_OR_private", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const link = yield db_1.LinkModel.findOne({ userId });
        if (link) {
            res.json({ type: "public", hash: link.hash });
        }
        else {
            res.json({ type: "private", hash: "" });
        }
    }
    catch (e) {
        res.status(500).json({ type: "private", hash: "" });
    }
}));
app.post("/api/v1/brain/share", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const brainName = req.body.brainName;
    try {
        let link = yield db_1.LinkModel.findOne({ userId });
        if (!link) {
            const hash = crypto_1.default.randomBytes(5).toString("hex");
            link = yield db_1.LinkModel.create({ userId, hash, brainName });
        }
        res.json({ hash: link.hash });
    }
    catch (e) {
        res.status(500).json({ message: "Failed to share brain" });
    }
}));
app.delete("/api/v1/brain/unshare", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        yield db_1.LinkModel.deleteOne({ userId });
        res.json({ message: "Brain unshared successfully" });
    }
    catch (e) {
        res.status(500).json({ message: "Failed to unshare brain" });
    }
}));
app.get("/api/v1/brain/public", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPublicLinks = yield db_1.LinkModel.find().lean();
        res.json(allPublicLinks);
    }
    catch (e) {
        console.error("Public fetch failed:", e);
        res.status(500).json({ message: "Failed to fetch public brains" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink.trim();
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const content = yield db_1.ContentModel.find({ userId: link.userId }).lean();
    res.json({
        content,
    });
}));
app.listen(3000);
