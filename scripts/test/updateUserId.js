const mongoose = require('mongoose');
const User = require('../../models/User');
require('dotenv').config();

const updateUserIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");

        const usersToUpdate = await User.find({ userId: { $exists: false } }); // Find users without userId

        if (usersToUpdate.length === 0) {
            console.log("No users found needing userId updates.");
            process.exit(0);
        }

        console.log(`Updating ${usersToUpdate.length} users with missing userId...`);

        for (let user of usersToUpdate) {
            // Saving the user will trigger the mongoose-sequence plugin for userId
            await user.save();
            console.log(`Assigned userId ${user.userId} to user with _id ${user._id}`);
        }

        console.log("User ID update complete.");
        process.exit(0);

    } catch (error) {
        console.error("Error updating user IDs:", error);
        process.exit(1);
    }
};

updateUserIds();
