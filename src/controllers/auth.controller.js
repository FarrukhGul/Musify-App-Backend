const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const bcrypt = require('bcryptjs')

async function registerUser(req ,res){
    try {
        const { username, email, password, role = 'user' } = req.body;

        // Validation - Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // If username is not provided, use email's local part as username
        const finalUsername = username || email.split('@')[0];

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { email }  // Only check email, username can be generated
            ]
        });

        if(isUserAlreadyExists){
            return res.status(409).json({
                message: "User already exists with this email"
            });
        };

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username: finalUsername, 
            email,
            password: hash,
            role,
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role, 
        }, process.env.JWT_SECRET);

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,          
  sameSite: 'none',    
  maxAge: 7 * 24 * 60 * 60 * 1000  
});

        res.status(201).json({
            message: "User registered successfully...",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

async function loginUser(req, res){
    try {
        const { username, email, password } = req.body;
        
        const user = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if(!user){
            return res.status(401).json({
                message: "Invalid Credentials..."
            });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({  // 🔴 FIX: Added return here
                message: "Invalid Credentials..."
            });
        };

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: "User Logged in Successfully...",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

async function logoutUser(req, res){
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,          
  sameSite: 'none',     
  maxAge: 7 * 24 * 60 * 60 * 1000  ,
  message: "User Logged out Successfully...",
});
};

module.exports = { registerUser, loginUser, logoutUser };