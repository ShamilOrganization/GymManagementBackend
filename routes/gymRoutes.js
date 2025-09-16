const express = require('express');
const { protect, isOwnerPermission } = require('../middleware/authMiddleware');
const { createGym, getAllGyms, getGymById, updateGym, deleteGym } = require('../controllers/gymController');
const { validateCreateGym, validateGymUpdate } = require('../middleware/validationMiddleware');
const router = express.Router();

// Gym Routes
router.post('/', protect, isOwnerPermission, validateCreateGym, createGym);
router.get('/', protect, isOwnerPermission, getAllGyms);
router.get('/:id', protect, isOwnerPermission, getGymById);
router.put('/:id', protect, isOwnerPermission, validateGymUpdate, updateGym);
router.delete('/:id', protect, isOwnerPermission, deleteGym);

module.exports = router;
