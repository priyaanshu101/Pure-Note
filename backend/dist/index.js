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
app.post("/api/v1/send-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, purpose } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const otp = (0, email_service_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        yield (0, email_service_1.sendOTPEmail)(email, otp, "signup");
        yield db_1.EmailVerificationModel.create({
            email,
            otp,
            purpose: purpose,
            expiresAt
        });
        res.status(200).json({ message: "OTP send successfully" });
    }
    catch (err) {
        console.error("Send signup OTP error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, purpose } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const verification = yield db_1.EmailVerificationModel.findOne({
            email,
            otp,
            purpose: purpose,
        });
        if (!verification) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        if (verification.expiresAt < new Date()) {
            yield db_1.EmailVerificationModel.deleteOne({ _id: verification._id });
            return res.status(400).json({ message: "OTP has expired" });
        }
        yield db_1.EmailVerificationModel.deleteOne({ _id: verification._id });
        return res.json({ message: "successfully" });
    }
    catch (err) {
        console.error("Verify OTP error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = yield db_1.UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Email or username already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.UserModel.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(200).json({ message: "User created. Proceed to OTP verification." });
    }
    catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and new password are required" });
    }
    try {
        const user = yield db_1.UserModel.findOne({ email: email });
        console.log(user === null || user === void 0 ? void 0 : user.username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log(hashedPassword);
        yield user.save();
        return res.json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
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
app.post("/api/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = req.body;
    try {
        const user = yield db_1.UserModel.findOne({
            $or: [{ username: credential }, { email: credential }],
        });
        if (!user)
            return res.status(403).json({ message: "User do not exist" });
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
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    const description = req.body.description;
    yield db_1.ContentModel.create({
        link,
        title,
        type,
        description,
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
const embedding_1 = require("./embedding");
app.get('/api/v1/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.q || '';
        const limit = Number(req.query.limit) || 10;
        const embedding = yield (0, embedding_1.getEmbedding)(searchTerm);
        // Step 1: Vector search results (returns full content records)
        const vectorResults = yield db_1.ContentModel.aggregate([
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
                    type: 1,
                    link: 1,
                    userId: 1,
                    tags: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);
        // Step 2: Regex match for title and description (fallback)
        const regexResults = yield db_1.ContentModel.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } }
            ]
        })
            .limit(20);
        // Step 3: Merge and remove duplicates by _id, prioritize vector results
        const map = new Map();
        // Add regex results first (lower priority)
        regexResults.forEach(item => {
            map.set(item._id.toString(), Object.assign(Object.assign({}, item.toObject()), { score: 0.5 }));
        });
        // Add vector results (higher priority, will overwrite regex results)
        vectorResults.forEach(item => {
            map.set(item._id.toString(), item);
        });
        const finalResults = Array.from(map.values())
            .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by score descending
            .slice(0, limit);
        res.json(finalResults);
    }
    catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, embedding_1.loadEmbeddingModel)();
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}))();
app.listen(3000);
