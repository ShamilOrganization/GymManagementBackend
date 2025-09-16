const cron = require('node-cron');
const moment = require('moment');
const User = require('../models/User');
const Payment = require('../models/Payment');
require('dotenv').config();
require('../config/db'); // Ensure DB connection

async function calculateAllUserPendingAmount() {
    try {
        const users = await User.find({});

        for (const user of users) {
            await calculateSingleUserPendingAmount(user);
        }

        console.log('Pending amount update completed.');
    } catch (error) {
        console.error('Error updating pending amounts:', error);
    }
}

async function calculateSingleUserPendingAmount(user) {
    try {
        const start = moment(user.joinedDate).startOf('month');
        const now = moment().startOf('month');

        const allMonths = [];
        let month = start.clone();
        while (month.isSameOrBefore(now)) {
            allMonths.push(month.format('YYYY-MM'));
            month.add(1, 'month');
        }

        const payments = await Payment.find({
            userId: user.userId,
            status: 'completed'
        });

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalExpected = allMonths.length * user.monthlyFee;

        const pending = totalExpected - totalPaid;
        const pendingAmount = pending >= 0 ? pending : 0;

        user.pendingAmount = pendingAmount;
        await user.save();

        console.log(`Updated user ${user.userId}, pending amount: ${pendingAmount}`);
    } catch (error) {
        console.error(`Error updating pending amount for user ${user.userId}:`, error);
    }
}

// 1. Schedule: At 00:00 on the 1st of every month
cron.schedule('0 0 1 * *', calculateAllUserPendingAmount);

// 1. Run immediately on server start
// calculatePendingAmounts();

module.exports = { calculateAllUserPendingAmount, calculateSingleUserPendingAmount };