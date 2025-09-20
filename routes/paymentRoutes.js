const express = require('express');
const { protect, isDeveloperPermission } = require('../middleware/authMiddleware');
const { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment, getPaymentsByUserId } = require('../controllers/paymentController');
const { validatePayment, validatePaymentUpdate } = require('../middleware/validationMiddleware');
const router = express.Router();

// Payment Routes
router.post('/', protect, isDeveloperPermission, validatePayment, createPayment);
router.get('/', protect, isDeveloperPermission, getAllPayments);
router.get('/:id', protect, isDeveloperPermission, getPaymentById);
router.put('/:id', protect, isDeveloperPermission, validatePaymentUpdate, updatePayment);
router.delete('/:id', protect, isDeveloperPermission, deletePayment);
router.get('/user/:userId', protect, isDeveloperPermission, getPaymentsByUserId);

module.exports = router;
