const User = require('../models/User');

const formatUserDetails = async (user) => {
    const details = {
        id: user.userId,
        name: user.name,
        phone: user.phone,
        role: user.role,
        gymId: user.gymId,
        lastPaymentId: user.lastPaymentId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    if (user.addedTrainerId) {
        const trainer = await User.findOne({ userId: user.addedTrainerId }).select('name');
        details.addedTrainer = trainer ? trainer.name : null;
    } else {
        details.addedTrainer = null;
    }

    return details;
};

module.exports = { formatUserDetails };
