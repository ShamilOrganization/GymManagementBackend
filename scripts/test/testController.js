// const bcrypt = require('bcryptjs');
// const faker = require('faker');
// const User = require('../../models/User');
// const Gym = require('../../models/Gym');
// const Payment = require('../../models/Payment'); // Add Payment model

// const createDummyUsers = async (req, res) => {
//     const numUsers = req.body.numUsers || 1000; // Allow specifying number of users in request body
//     try {
//         const startTime = process.hrtime.bigint();
//         console.log(`Creating ${numUsers} dummy users...`);

//         const gyms = await Gym.find({});
//         if (gyms.length === 0) {
//             return res.status(400).json({ message: 'No gyms found. Please create some gyms first.' });
//         }

//         const dummyUsers = [];
//         for (let i = 0; i < numUsers; i++) {
//             const randomGym = gyms[Math.floor(Math.random() * gyms.length)];
//             const password = 'password123'; // The pre-save hook will hash this

//             dummyUsers.push({
//                 gymId: randomGym.gymId,
//                 name: faker.name.findName(),
//                 phone: faker.phone.phoneNumber('##########'),
//                 password: password,
//                 role: faker.random.arrayElement(['member', 'member', 'member', 'developer', 'owner']),
//                 addedTrainerId: faker.datatype.number({ min: 1000, max: 9999 }),
//                 monthlyFee: faker.datatype.number({ min: 500, max: 2000, precision: 100 }),
//                 joinedDate: faker.date.past(),
//                 pendingAmount: faker.datatype.number({ min: 0, max: 1000, precision: 100 }),
//             });
//         }

//         // Create users one by one to trigger auto-increment and pre-save hooks
//         for (const userData of dummyUsers) {
//             const newUser = await User.create(userData);
//             console.log(`User created: ${newUser.userId} - ${newUser.name}`);
//         }

//         console.log(`${numUsers} dummy users created successfully!`);
//         const endTime = process.hrtime.bigint();
//         const elapsedTimeInSeconds = Number(endTime - startTime) / 1_000_000_000;
//         console.log(`createDummyUsers for ${numUsers} users took ${elapsedTimeInSeconds.toFixed(2)} seconds.`);
//         res.status(201).json({ message: `${numUsers} dummy users created successfully!` });
//     } catch (error) {
//         console.error('Error creating dummy users:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const createDummyPayments = async (req, res) => {
//     const numPaymentsPerUser = req.body.numPaymentsPerUser || 10; // Default to 10 payments per user
//     try {
//         const startTime = process.hrtime.bigint();
//         console.log(`Creating ${numPaymentsPerUser} dummy payments for all users...`);

//         const users = await User.find({});
//         if (users.length === 0) {
//             return res.status(400).json({ message: 'No users found. Please create some users first.' });
//         }

//         let paymentsCreatedCount = 0;
//         for (const user of users) {
//             if (!user.userId || typeof user.userId !== 'number') {
//                 console.warn(`Skipping user without valid userId: ${user._id}`);
//                 continue; // Skip this user if userId is invalid
//             }
//             for (let i = 0; i < numPaymentsPerUser; i++) {
//                 const newPayment = await Payment.create({
//                     userId: user.userId,
//                     amount: faker.datatype.number({ min: 100, max: 1000, precision: 50 }),
//                     status: 'completed',
//                 });
//                 console.log(`Payment created: ${newPayment.paymentId} for user ${newPayment.userId}`);
//                 paymentsCreatedCount++;
//             }
//         }

//         console.log(`${paymentsCreatedCount} dummy payments created successfully!`);
//         const endTime = process.hrtime.bigint();
//         const elapsedTimeInSeconds = Number(endTime - startTime) / 1_000_000_000;
//         console.log(`createDummyPayments for ${numPaymentsPerUser} payments per user took ${elapsedTimeInSeconds.toFixed(2)} seconds.`);
//         res.status(201).json({ message: `${paymentsCreatedCount} dummy payments created successfully!` });
//     } catch (error) {
//         console.error('Error creating dummy payments:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// module.exports = { createDummyUsers, createDummyPayments };
