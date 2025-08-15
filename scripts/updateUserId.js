const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateUserIds = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB...");

        // Find all users without a userId
        const users = await User.find({ userId: { $exists: false } }).sort({ _id: 1 });

        if (users.length === 0) {
            console.log("All users already have a userId.");
            process.exit(0);
        }

        console.log(`Updating ${users.length} users...`);

        let lastUser = await User.findOne().sort({ userId: -1 });
        let nextId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

        for (let user of users) {
            await User.updateOne({ _id: user._id }, { $set: { userId: nextId } });
            console.log(`Assigned userId ${nextId} to ${user.email}`);
            nextId++;
        }

        console.log("User ID update complete.");
        process.exit(0);

    } catch (error) {
        console.error("Error updating userId:", error);
        process.exit(1);
    }
};

updateUserIds();
