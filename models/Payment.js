const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PaymentSchema = new mongoose.Schema({
    paymentId: { type: Number, unique: true },
    userId: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        required: true,
        default: 'pending'
    },
}, { timestamps: true });

PaymentSchema.plugin(AutoIncrement, { inc_field: 'paymentId', start_seq: 10001 });

PaymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema, 'payments');
