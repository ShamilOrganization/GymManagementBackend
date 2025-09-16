const User = require('../models/User');
const moment = require('moment');
const { calculateAllUserPendingAmount, calculateSingleUserPendingAmount } = require('../scripts/calculatePendingAmount');

const triggerCalculatePendingAmounts = async (req, res) => {
    try {
        const startTime = moment();
        await calculateAllUserPendingAmount();
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

const triggerSingleUserCalculatePendingAmount = async (req, res) => {
    try {
        const startTime = moment();
        const { userId } = req.params;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await calculateSingleUserPendingAmount(user);
        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime));
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        res.json({ success: true, message: `Pending amount calculation for user ${userId} triggered successfully in ${minutes} minutes ${seconds} seconds.` });
    } catch (error) {
        console.error(`Error triggering single user pending amounts calculation for user ${req.params.userId}:`, error);
        res.status(500).json({ success: false, message: 'Failed to trigger single user pending amounts calculation.' });
    }
};

module.exports = { triggerCalculatePendingAmounts, triggerSingleUserCalculatePendingAmount };
