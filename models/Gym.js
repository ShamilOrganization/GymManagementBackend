const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const GymSchema = new mongoose.Schema({
    gymId: { type: Number, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    geopoint: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    normalFee: { type: Number, required: true }
}, { timestamps: true });

GymSchema.plugin(AutoIncrement, { inc_field: 'gymId' });

module.exports = mongoose.model('Gym', GymSchema, 'gyms');
