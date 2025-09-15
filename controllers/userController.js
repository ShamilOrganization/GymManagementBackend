const User = require('../models/User');
const { formatUserDetails } = require('../utils/userUtils');
const { calculatePendingAmounts } = require('../scripts/calculatePendingAmount');
const moment = require('moment');

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

const triggerCalculatePendingAmounts = async (req, res) => {
    try {
        const startTime = moment();
        await calculatePendingAmounts();
        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime));
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        res.json({ success: true, message: `Pending amounts calculation triggered successfully in ${minutes} minutes ${seconds} seconds.` });
    } catch (error) {
        console.error('Error triggering pending amounts calculation:', error);
        res.status(500).json({ success: false, message: 'Failed to trigger pending amounts calculation.' });
    }
};

module.exports = { getAllMembers, getMyProfile, setUserAdmin, createUser, triggerCalculatePendingAmounts };