const User = require('../models/User');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    // Map users to clean format
    const cleanedUsers = users.map(user => ({
        id: user.userId,
        name: user.name,
        phone: user.phone || null,
        role: user.role,
        gymId: user.gymId || null
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

module.exports = { getAllUsers, setUserAdmin };