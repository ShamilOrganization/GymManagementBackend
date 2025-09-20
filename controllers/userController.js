const User = require('../models/User');
const { formatUserDetails } = require('../utils/formatUtils');
const { calculateSingleUserPendingAmount } = require('../utils/calculatePendingAmount');

const getAllMembers = async (req, res) => {
    const gymId = req.user.gymId;
    const { search, startDate, endDate, page = 1, limit = 20 } = req.query;

    let query = { gymId, role: 'member' };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }

    if (startDate || endDate) {
        query.$and = [];
        if (startDate) {
            query.$and.push({ joinedDate: { $gte: new Date(startDate) } });
            query.$and.push({ createdAt: { $gte: new Date(startDate) } });
        }
        if (endDate) {
            query.$and.push({ joinedDate: { $lte: new Date(endDate) } });
            query.$and.push({ createdAt: { $lte: new Date(endDate) } });
        }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    // Fetch all users matching the query for summary calculation
    const allUsersForSummary = await User.find(query).select('-password').populate({
        path: 'lastPaymentId',
        foreignField: 'paymentId',
        model: 'Payment',
        select: 'paymentId amount createdAt',
        justOne: true
    });
    const cleanedAllUsersForSummary = await Promise.all(allUsersForSummary.map(async (user) => {
        return await formatUserDetails(user);
    }));

    // Calculate summary based on all matching users
    const total = cleanedAllUsersForSummary.length;
    const active = cleanedAllUsersForSummary.filter(user => user.status === 'active').length;
    const pending = cleanedAllUsersForSummary.filter(user => user.status === 'pending').length;
    const closed = cleanedAllUsersForSummary.filter(user => user.status === 'closed').length;

    const users = await User.find(query).select('-password').populate({
        // const users = await User.find({ gymId, }).select('-password').populate({
        path: 'lastPaymentId',
        foreignField: 'paymentId',
        model: 'Payment',
        select: 'paymentId amount createdAt',
        justOne: true
    })
        .skip(skip)
        .limit(parseInt(limit));
    // const users = await User.find({ gymId, role: 'member' }).select('-password');
    // Map users to clean format
    const cleanedUsers = await Promise.all(users.map(async (user) => {
        return await formatUserDetails(user);
    }));

    // Calculate summary
    // const total = cleanedUsers.length;
    // const active = cleanedUsers.filter(user => user.status === 'active').length;
    // const pending = cleanedUsers.filter(user => user.status === 'pending').length;
    // const closed = cleanedUsers.filter(user => user.status === 'closed').length;

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
            members: cleanedUsers,
            currentPage: parseInt(page),
            totalPages,
            totalUsers
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

        await calculateSingleUserPendingAmount(user);

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
        const user = await User.findById(req.user.id)
            .populate({
                path: 'lastPaymentId',
                foreignField: 'paymentId',
                model: 'Payment',
                select: 'paymentId amount createdAt',
                justOne: true
            });

        if (!user) {
            return res.status(404).json({ success: false, data: null, message: 'User not found' });
        }

        const formattedUser = await formatUserDetails(user);
        res.json({
            success: true,
            message: 'User profile fetched successfully',
            data: formattedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, data: null, message: error.message });
    }
};

module.exports = { getAllMembers, getMyProfile, setUserAdmin, createUser };