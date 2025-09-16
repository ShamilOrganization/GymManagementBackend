const User = require('../models/User');
const { formatUserDetails } = require('../utils/userUtils');

const getAllMembers = async (req, res) => {
    const gymId = req.user.gymId;
    const users = await User.find({ gymId, role: 'developer' }).select('-password');
    // const users = await User.find({ gymId, role: 'member' }).select('-password');
    // Map users to clean format
    const cleanedUsers = await Promise.all(users.map(async (user) => {
        return await formatUserDetails(user);
    }));

    // Calculate summary
    const total = cleanedUsers.length;
    const active = cleanedUsers.filter(user => user.status === 'active').length;
    const pending = cleanedUsers.filter(user => user.status === 'pending').length;
    const closed = cleanedUsers.filter(user => user.status === 'closed').length;

    res.json({
        success: true,
        message: 'Users fetched successfully',
        data: {
            summary: {
                total,
                active,
                pending,
                closed
            },
            members: cleanedUsers
        }
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
        const { name, phone, password, monthlyFee, joinedDate } = req.body;

        // The admin's gymId is available from req.user (set by protect middleware)
        const gymId = req.user.gymId;
        const addedTrainerId = req.user.userId; // Get the admin's userId as the addedTrainerId

        const user = await User.create({
            name,
            phone,
            password,
            gymId,
            role: 'member',
            addedTrainerId, // Set the addedTrainerId
            monthlyFee, // Set the monthlyFee
            joinedDate // Set the joinedDate
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

const getMyProfile = async (req, res) => {
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

module.exports = { getAllMembers, getMyProfile, setUserAdmin, createUser };