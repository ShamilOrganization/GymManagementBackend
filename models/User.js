const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // Auto-incremented user ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Password will not be returned by default
    role: {
        type: String, 
        enum: ['user', 'admin'], 
        required: true, // ✅ Enforce role to be mandatory
        default: 'user'
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
