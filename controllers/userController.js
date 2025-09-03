const User = require('../models/User');
const { formatUserDetails } = require('../utils/userUtils');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    // Map users to clean format
    const cleanedUsers = await Promise.all(users.map(async (user) => {
        return await formatUserDetails(user);
    }));

    res.json({
        success: true,
        message: 'Users fetched successfully',
        data: cleanedUsers
    });
};

const setUserAdmin = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: parseInt(req.params.id) },
            { role: 'admin' },
            { new: true } // `new: true` returns the updated document
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ "success": true, data: true, "message": "User set admin successfully" });
    } catch (error) {
        res.json(500).json({ success: false, data: null, message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ success: false, data: null, message: 'User with this phone number already exists' });
        }

        // The admin's gymId is available from req.user (set by protect middleware)
        const gymId = req.user.gymId;
        const addedTrainerId = req.user.userId; // Get the admin's userId as the addedTrainerId

        const user = await User.create({
            name,
            phone,
            password,
            gymId,
            role: 'member',
            addedTrainerId // Set the addedTrainerId
        });

        const formattedUser = await formatUserDetails(user);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: formattedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, data: null, message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        // req.user is populated by the protect middleware
        if (req.user) {
            const formattedUser = await formatUserDetails(req.user);
            res.json({
                success: true,
                message: 'User profile fetched successfully',
                data: formattedUser
            });
        } else {
            res.status(404).json({ success: false, data: null, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, data: null, message: error.message });
    }
};

module.exports = { getAllUsers, setUserAdmin, createUser, getUserProfile };