const express = require('express');
const { getAllUsers, setUserAdmin, createUser, getUserProfile } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', protect, isAdmin, getAllUsers);
router.post('/setAdmin/:id', protect, isAdmin, setUserAdmin);
router.post('/create', protect, isAdmin, createUser);
router.get('/profile', protect, getUserProfile);
module.exports = router;