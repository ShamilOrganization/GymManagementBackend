const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // Auto-incremented user ID
    gymId: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Password will not be returned by default
    role: {
        type: String, 
        enum: ['member', 'admin','owner'], 
        required: true, // ✅ Enforce role to be mandatory
        default: 'member'
    }
});

// Auto-increment userId field
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema, 'users');
