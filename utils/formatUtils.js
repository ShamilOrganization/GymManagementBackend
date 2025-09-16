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
        lastPaymentId: user.lastPaymentId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: user.lastPaymentId === null ? 'pending' : 'active'
    };

    if (user.addedTrainerId) {
        const trainer = await User.findOne({ userId: user.addedTrainerId }).select('name');
        details.addedTrainer = trainer ? trainer.name : null;
    } else {
        details.addedTrainer = null;
    }
    // if (user.lastPaymentId && typeof user.lastPaymentId === 'object') {
    //     const payment = user.lastPaymentId;
    //     details.lastPayment = {
    //         amount: payment.amount,
    //         // date: moment(payment.date).format('YYYY-MM-DD'),
    //         // status: payment.status || 'unknown'
    //     };
    // }
    return details;
};

const formatPaymentDetails = (payment) => {
    return {
        id: payment.paymentId,
        userId: payment.userId,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
    };
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