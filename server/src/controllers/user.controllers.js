import userModel from "../models/user.models.js";
import config from "../config/config.js";
import mongoose from "mongoose";
import { generateTokens, verifyRefreshToken } from "../utils/auth.utils.js";
import bcrypt from "bcryptjs";


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const isUserExists = await userModel.findOne({ email });
        if (isUserExists) {
            return res.status(400).json({
                messege: "User already exists",
                errors: [
                    {
                        field: "email",
                        messege: "User already exists with this email"
                    }
                ]
            });
        }
        const newUser = await userModel.create({
            name,
            email,
            password: await bcrypt.hash(password, 12),
            role: req.body.role === "seller" ? "seller" : "user"
        });

        const { accessToken, refreshToken } = generateTokens({ userId: newUser._id, role: newUser.role });
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            accessToken
        })



    } catch (error) {
        return res.status(500).json({
            messege: "Internal server error"
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                messege: "User doesnot exists..."
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                messege: "Invalid email or password"
            })
        }

        const { accessToken, refreshToken } = generateTokens({ userId: user._id, role: user.role });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            message: "User logged in successfully",
            data: { name: user.name, email: user.email, role: user.role },
            accessToken
        });

    } catch (error) {
        return res.status(500).json({
            messege: "Internal server error"
        })
    }
};

const logOut = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        if (!refreshToken) {
            return res.status(200).json({ message: "User logged out successfully" });
        }
        const decoded = verifyRefreshToken(refreshToken);
        const user = await userModel.findById(decoded.userId);

        if (!user || refreshToken !== user.refreshToken) {
            return res.status(200).json({
                messege: "User logged out successfully"
            })
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        return res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (error) {
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
}

const getMe = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findOne(userId);

        return res.status(200).json({
            messege: "User fetched successfully",
            data: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });

    } catch (error) {
        return res.status(500).json({
            messege: "Internal server error"
        })
    }
}

const newRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        if (!refreshToken) {
            return res.status(400).json({
                messege: "RefreshToken not found"
            })
        }
        const decode = await verifyRefreshToken(refreshToken);
        const user = await userModel.findById({ id: decode._id });
        if (refreshToken !== user.refreshToken) {
            user.refreshToken = null;
            await user.save();

            return res.status(401).json({
                messege: "Invalid refreshToken"
            })
        };

        const { accessToken, refreshToken: newRefreshToken } = generateTokens({ userId: user._id });
        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie("refrehToken", newRefreshToken, { httpOnly: true });

        return res.status(200).json({
            messege: "Tokens rotated successfully"
        }, accessToken);


    } catch (error) {
        return res.status(500).json({
            messege: "Internal server error"
        })
    }
}

export { registerUser, loginUser, getMe, logOut, newRefreshToken }