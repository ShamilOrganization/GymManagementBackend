const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateUserIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");

        const users = await User.find();

        if (users.length === 0) {
            console.log("No users found.");
            process.exit(0);
        }

        console.log(`Updating ${users.length} users...`);

        for (let user of users) {
            const updateQuery = {};

            // Set phone and gymId if phone is missing
            if (!user.phone || user.phone === null) {
                updateQuery.$set = { phone: "122", gymId: null };
            }

            // Remove email if it exists
            if (user.email) {
                updateQuery.$unset = { email: "" };
            }

            // Only update if there’s something to update
            if (Object.keys(updateQuery).length > 0) {
                await User.updateOne({ _id: user._id }, updateQuery);
                console.log(`Updated user with _id ${user._id}`);
            }
        }

        console.log("User update complete.");
        process.exit(0);

    } catch (error) {
        console.error("Error updating users:", error);
        process.exit(1);
    }
};

updateUserIds();
