const express = require('express');
const { getAllUsers, setUserAdmin, createUser, getUserProfile } = require('../controllers/userController');
const { protect, isOwnerPermission } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', protect, isOwnerPermission, getAllUsers);
// router.post('/setAdmin/:id', protect, isAdminPermission, setUserAdmin);
router.post('/create', protect, isOwnerPermission, createUser);
router.get('/profile', protect, getUserProfile);
module.exports = router;