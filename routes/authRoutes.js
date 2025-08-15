const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
module.exports = router;