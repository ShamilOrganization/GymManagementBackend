const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // Auto-incremented user ID
    gymId: { type: mongoose.Schema.Types.Number, ref: 'Gym', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['member', 'developer', 'owner'],
        required: true,
        default: 'member'
    },
    addedTrainerId: { type: Number, required: true },
    monthlyFee: { type: Number, required: true },
    joinedDate: { type: Date, default: Date.now },
    pendingAmount: { type: Number, default: 0 },
    lastPaymentId: { type: mongoose.Schema.Types.Number, ref: 'Payment', default: null }, // New field for last payment ID
}, { timestamps: true }); // Add timestamps option

// Auto-increment userId field
UserSchema.plugin(AutoIncrement, { inc_field: 'userId',start_seq: 1001 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.index({ gymId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ addedTrainerId: 1 });

module.exports = mongoose.model('User', UserSchema, 'users'); 