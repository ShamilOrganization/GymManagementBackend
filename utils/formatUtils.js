const User = require('../models/User');
const moment = require('moment');

const formatUserDetails = async (user) => {
    const details = {
        id: user.userId,
        name: user.name,
        phone: user.phone,
        role: user.role,
        gymId: user.gymId,
        monthlyFee: user.monthlyFee,
        joinedDate: moment(user.joinedDate).format('YYYY-MM-DD'),
        pendingAmount: user.pendingAmount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: user.pendingAmount === 0 ? 'active' : 'pending'
    };

    if (user.lastPaymentId && typeof user.lastPaymentId === 'object') {
        const payment = user.lastPaymentId;
        details.lastPayment = {
            id: payment.paymentId,
            amount: payment.amount,
            date: payment.createdAt
        };
    } else {
        details.lastPayment = null;
    }
    return details;
};

const formatPaymentDetails = (payment) => {
    const details = {
        id: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        user: { id:payment.userId.userId, name: payment.userId.name, phone: payment.userId.phone, },
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
    };
    return details;
};

const formatGymDetails = (gym) => {
    return {
        id: gym.gymId,
        name: gym.name,
        address: gym.address,
        latitude: gym.geopoint.latitude,
        longitude: gym.geopoint.longitude,
        normalFee: gym.normalFee,
        createdAt: gym.createdAt,
        updatedAt: gym.updatedAt,
    };
};

module.exports = { formatUserDetails, formatPaymentDetails, formatGymDetails };