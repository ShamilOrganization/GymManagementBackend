const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validateRegistration = [
    // Name validation
    body('name').notEmpty().withMessage('Name is required'),

    // Email validation (Format Check)
    body('email')
        .notEmpty().withMessage('Email is required')
        .bail() // Stops if the previous validation fails
        .isEmail().withMessage('Invalid email format')
        .bail()
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }),

    // Password validation (Minimum length 6 characters)
    body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    // Middleware to return only the first error
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null,  message: errors.array()[0].msg }); // Return the first error only
        }
        next();
    }
];

module.exports = { validateRegistration };
