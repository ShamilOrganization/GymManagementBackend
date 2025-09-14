const express = require('express');
const { getMyProfile, setUserAdmin, createUser, getAllMembers } = require('../controllers/userController');
const { protect, isOwnerPermission } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', protect, getMyProfile);
// router.post('/setAdmin/:id', protect, isAdminPermission, setUserAdmin);
router.post('/create', protect, isOwnerPermission, createUser);
router.get('/members', protect, isOwnerPermission, getAllMembers);
module.exports = router;