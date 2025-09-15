const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PaymentSchema = new mongoose.Schema({
    paymentId: { type: Number, unique: true },
    photo: { type: String, required: true }, // URL or path to the payment photo
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        required: true,
        default: 'pending'
    },
}, { timestamps: true });

PaymentSchema.plugin(AutoIncrement, { inc_field: 'paymentId' });

PaymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema, 'payments');
