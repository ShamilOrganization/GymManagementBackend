const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { name, phone, password, gymId, role } = req.body;

        // Validate required fields
        if (!name || !phone || !password || !gymId) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Name, phone, password, and gymId are required"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User already exists"
            });
        }

        // Create user (password will be hashed by schema pre-save hook)
        const user = await User.create({ name, phone, password, gymId, role });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user.userId, // Auto-incremented ID
                name: user.name,
                phone: user.phone,
                role: user.role,
                token
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, data: null, message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate required fields
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Phone and password are required"
            });
        }

        // Find user and select password for verification
        const user = await User.findOne({ phone }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, data: null, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, data: null, message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: "Successfully logged in",
            data: {
                id: user.userId,
                name: user.name,
                phone: user.phone || null,
                role: user.role,
                token,
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, data: null, message: "Internal server error" });
    }
};

module.exports = { register, login };
