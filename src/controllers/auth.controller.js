const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { uploadFile } = require('../services/storage.service');

async function registerUser(req, res) {
    try {
        const { username, email, password, role = 'user' } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const finalUsername = username || email.split('@')[0];

        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username: finalUsername, email, password: hash, role });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({ $or: [{ username }, { email }] });
        if (!user) return res.status(401).json({ message: "Invalid Credentials" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials" });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "User Logged in Successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}

async function logoutUser(req, res) {
    res.status(200).json({ message: "User logged out successfully" });
}


async function updateProfile(req, res) {
    try {
        const { username, bio } = req.body;
        const file = req.file;

        console.log('File received:', file ? file.originalname : 'NO FILE');
        console.log('File size:', file?.size);

        // Pehle existing user dhundo
        const existingUser = await userModel.findById(req.user.id);

        // Agar naya file aya to upload karo, warna purani pic rakhho
        let profilePicUrl = existingUser.profilePic || '';

        if (file) {
            try {
                const result = await uploadFile(file.buffer.toString('base64'));
                console.log('ImageKit URL:', result.url);
                profilePicUrl = result.url;
            } catch (uploadError) {
                console.error('ImageKit upload error:', uploadError);
                return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            }
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { username, bio, profilePic: profilePicUrl },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: "Profile update failed", error: error.message });
    }
}

async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to get profile", error: error.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, updateProfile, getProfile };

