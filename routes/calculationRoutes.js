const express = require('express');
const { protect, isDeveloperPermission } = require('../middleware/authMiddleware');
const { triggerCalculatePendingAmounts, triggerSingleUserCalculatePendingAmount } = require('../controllers/calculationController');
const router = express.Router();

// Calculation Routes
router.post('/all-users', protect, isDeveloperPermission, triggerCalculatePendingAmounts);
router.post('/single-user/:userId', protect, isDeveloperPermission, triggerSingleUserCalculatePendingAmount);

module.exports = router;