const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validateCreateUser = [
    // Name validation
    body('name').notEmpty().withMessage('Name is required'),

    // Email validation (Format Check)
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .bail() // Stops if the previous validation fails
        .custom(async (phone) => {
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                throw new Error('This phone number is already registered.');
            }
        }),

    // Password validation (Minimum length 6 characters)
    body('password')
        .notEmpty().withMessage('Password cannot be empty')
        .bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('monthlyFee')
        .notEmpty().withMessage('Monthly fee is required')
        .bail()
        .isNumeric().withMessage('Monthly fee must be a number'),

    body('joinedDate')
        .optional()
        .isISO8601().withMessage('Joined date must be a valid date in YYYY-MM-DD format')
        .toDate(), // Convert to a Date object

    // Middleware to return only the first error
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null, message: errors.array()[0].msg }); // Return the first error only
        }
        next();
    }
];

module.exports = { validateCreateUser };
