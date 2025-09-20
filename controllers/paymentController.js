const Payment = require('../models/Payment');
const User = require('../models/User');
const moment = require('moment');
const { calculateSingleUserPendingAmount } = require('../utils/calculatePendingAmount');
const { formatPaymentDetails } = require('../utils/formatUtils');

// Create a new payment
const createPayment = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const payment = new Payment({
            userId,
            amount,
            status: 'completed'
        });

        const newPayment = await payment.save();

        user.lastPaymentId = newPayment.paymentId;
        await calculateSingleUserPendingAmount(user);

        res.status(201).json({ success: true, message: 'Payment created successfully.', data: formatPaymentDetails(newPayment) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const totalPayments = await Payment.countDocuments({});
        const totalPages = Math.ceil(totalPayments / limit);

        const payments = await Payment.find({})
            .populate({
                path: 'userId',
                foreignField: 'userId',
                model: 'User',
                select: 'userId name phone',
                justOne: true
            })
            .skip(skip)
            .limit(parseInt(limit));
        const formattedPayments = payments.map(formatPaymentDetails);
        res.status(200).json({
            success: true,
            message: 'Payments fetched successfully.',
            data: {
                payments: formattedPayments,
                currentPage: parseInt(page),
                totalPages,
                totalPayments
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({ paymentId: req.params.id })
            .populate({
                path: 'userId',
                foreignField: 'userId',
                model: 'User',
                select: 'userId name phone',
                justOne: true
            });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: 'Payment fetched successfully.', data: formatPaymentDetails(payment) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a payment
const updatePayment = async (req, res) => {
    try {
        const { amount, status } = req.body;
        const payment = await Payment.findOneAndUpdate(
            { paymentId: req.params.id },
            { amount, status },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: 'Payment updated successfully.', data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a payment
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndDelete({ paymentId: req.params.id });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: 'Payment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await Payment.find({ userId: parseInt(userId) })
            .populate({
                path: 'userId',
                foreignField: 'userId',
                model: 'User',
                select: 'userId name phone',
                justOne: true
            });

        if (!payments || payments.length === 0) {
            return res.status(404).json({ success: false, message: 'No payments found for this user.' });
        }

        const formattedPayments = payments.map(formatPaymentDetails);
        res.status(200).json({ success: true, message: 'Payments fetched successfully by user ID.', data: formattedPayments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment, getPaymentsByUserId };
