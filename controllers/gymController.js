const Gym = require('../models/Gym');

// Create a new gym
const createGym = async (req, res) => {
    try {
        const { name, address, geopoint, normalFee } = req.body;
        const gym = new Gym({
            name,
            address,
            geopoint,
            normalFee
        });
        const newGym = await gym.save();
        res.status(201).json({ success: true, message: 'Gym created successfully.', data: newGym });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all gyms
const getAllGyms = async (req, res) => {
    try {
        const gyms = await Gym.find({});
        res.status(200).json({ success: true, message: 'Gyms fetched successfully.', data: gyms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get gym by ID
const getGymById = async (req, res) => {
    try {
        const gym = await Gym.findOne({ gymId: req.params.id });
        if (!gym) {
            return res.status(404).json({ success: false, message: 'Gym not found.' });
        }
        res.status(200).json({ success: true, message: 'Gym fetched successfully.', data: gym });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a gym
const updateGym = async (req, res) => {
    try {
        const { name, address, geopoint, normalFee } = req.body;
        const gym = await Gym.findOneAndUpdate(
            { gymId: req.params.id },
            { name, address, geopoint, normalFee },
            { new: true, runValidators: true }
        );

        if (!gym) {
            return res.status(404).json({ success: false, message: 'Gym not found.' });
        }
        res.status(200).json({ success: true, message: 'Gym updated successfully.', data: gym });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a gym
const deleteGym = async (req, res) => {
    try {
        const gym = await Gym.findOneAndDelete({ gymId: req.params.id });
        if (!gym) {
            return res.status(404).json({ success: false, message: 'Gym not found.' });
        }
        res.status(200).json({ success: true, message: 'Gym deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createGym, getAllGyms, getGymById, updateGym, deleteGym };
