const express = require('express');
const { getAllUsers ,setUserAdmin} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', protect, isAdmin, getAllUsers);
router.post('/setAdmin/:id', protect, isAdmin, setUserAdmin);
module.exports = router;