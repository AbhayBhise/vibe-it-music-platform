import imagekit from "../config/imagekit.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import asyncHandler from "express-async-handler";

dotenv.config();

const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

const signup = asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required.");
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be at least 8 characters long.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User with this Email already exists.");
    }

    let avatarUrl = "";
    if (avatar) {
        const uploadResponse = await imagekit.upload({
            file: avatar,
            fileName: `avatar_${Date.now()}.jpg`,
            folder: "/mern-music-player",
        });
        avatarUrl = uploadResponse.url;
    }

    const user = await User.create({
        name, email, password, avatar: avatarUrl,
    });

    const token = createToken(user._id);

    res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            favourites: user.favourites || [],
        },
        token,
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email and Password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Invalid credentials.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(400);
        throw new Error("Invalid credentials.");
    }

    const token = createToken(user._id);

    res.status(200).json({
        message: "User logged in successfully!",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            favourites: user.favourites || [],
        },
        token,
    });
});

// Protected controller (Protected Routing)
const getMe = (req, res) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated." });
    res.status(200).json(req.user);
};

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("Email is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User with this email does not exist.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `<h3>You requested a password reset.</h3><br>
        <p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 10 minutes.</p>`
    });

    res.status(200).json({ message: "Password reset link has been sent to your email." });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
        res.status(400);
        throw new Error("Password must be at least 8 characters long.");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Token is invalid or expired.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
});

const editProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401);
        throw new Error("User not authenticated.");
    }

    const { name, email, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (currentPassword && newPassword) {
        if (!currentPassword || !newPassword) {
            res.status(400);
            throw new Error("Both current and new passwords are required.");
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(400);
            throw new Error("Current password is incorrect.");
        }
        if (newPassword.length < 8) {
            res.status(400);
            throw new Error("New password must be at least 8 characters long.");
        }
        user.password = newPassword;
    }

    if (avatar) {
        const uploadResponse = await imagekit.upload({
            file: avatar,
            fileName: `avatar_${userId}_${Date.now()}.jpg`,
            folder: "/mern-music-player",
        });
        user.avatar = uploadResponse.url;
    }

    await user.save();
    
    return res.status(200).json({
        message: "Profile updated successfully.",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }
    });
});

export { signup, login, getMe, forgotPassword, resetPassword, editProfile };
