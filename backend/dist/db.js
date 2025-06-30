"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.EmailVerificationModel = exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongodbURL = process.env.mongodbURL;
mongoose_1.default.connect(mongodbURL);
console.log("listen: 3000");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const embedding_1 = require("./embedding");
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    type: String,
    description: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    embedding: { type: [Number] }
});
ContentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = `${this.title} ${this.description}`;
        try {
            const vector = yield (0, embedding_1.getEmbedding)(text);
            // @ts-ignore
            this.embedding = vector;
        }
        catch (err) {
            console.error('Embedding failed:', err);
            //@ts-ignore
            return next(err);
        }
        next();
    });
});
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, unique: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
    brainName: { type: String, required: true }
});
exports.LinkModel = (0, mongoose_1.model)("Links", LinkSchema);
const emailVerificationSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: ['signup', 'forgot-password'], required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true, });
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.EmailVerificationModel = (0, mongoose_1.model)("EmailVerification", emailVerificationSchema);
