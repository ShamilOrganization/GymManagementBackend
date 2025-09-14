const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, data: null, message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ success: false, data: null, message: 'Invalid token' });
    }
};

const isDeveloperPermission = (req, res, next) => {
    if (req.user.role !== 'developer') {
        return res.status(403).json({ success: false, data: null, message: 'Forbidden: Your not admin' });
    }
    next();
};

const isOwnerPermission = (req, res, next) => {
    if (req.user.role !== 'owner' && req.user.role !== 'developer') {
        return res.status(403).json({ success: false, data: null, message: 'Forbidden: Your not admin' });
    }
    next();
};

module.exports = { protect, isOwnerPermission, isDeveloperPermission };