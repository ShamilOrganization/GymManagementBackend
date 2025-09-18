const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validateCreateUser = [
    // Name validation
    body('name').notEmpty().withMessage('Name is required'),

    // Email validation (Format Check)
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .bail() // Stops if the previous validation fails
        .isNumeric().withMessage('Phone number must contain only digits')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long')
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

const validatePayment = [
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .bail()
        .isNumeric().withMessage('User ID must be a number')
        .custom(async (userId) => {
            const user = await User.findOne({ userId });
            if (!user) {
                throw new Error('User not found');
            }
        }),
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .bail()
        .isNumeric().withMessage('Amount must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null, message: errors.array()[0].msg });
        }
        next();
    }
];

const validatePaymentUpdate = [
    body('amount')
        .optional()
        .isNumeric().withMessage('Amount must be a number'),
    body('status')
        .optional()
        .isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid status'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null, message: errors.array()[0].msg });
        }
        next();
    }
];

const validateCreateGym = [
    body('name').notEmpty().withMessage('Gym name is required'),
    body('address').notEmpty().withMessage('Gym address is required'),
    body('geopoint.latitude')
        .notEmpty().withMessage('Latitude is required')
        .bail()
        .isNumeric().withMessage('Latitude must be a number'),
    body('geopoint.longitude')
        .notEmpty().withMessage('Longitude is required')
        .bail()
        .isNumeric().withMessage('Longitude must be a number'),
    body('normalFee')
        .notEmpty().withMessage('Normal fee is required')
        .bail()
        .isNumeric().withMessage('Normal fee must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null, message: errors.array()[0].msg });
        }
        next();
    }
];

const validateGymUpdate = [
    body('name')
        .optional()
        .notEmpty().withMessage('Gym name cannot be empty if provided'),
    body('address')
        .optional()
        .notEmpty().withMessage('Gym address cannot be empty if provided'),
    body('geopoint.latitude')
        .optional()
        .isNumeric().withMessage('Latitude must be a number'),
    body('geopoint.longitude')
        .optional()
        .isNumeric().withMessage('Longitude must be a number'),
    body('normalFee')
        .optional()
        .isNumeric().withMessage('Normal fee must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, data: null, message: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = { validateCreateUser, validatePayment, validatePaymentUpdate, validateCreateGym, validateGymUpdate };
