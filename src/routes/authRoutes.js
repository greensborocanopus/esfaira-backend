const express = require('express');
const { login, register, forgotPassword, updatePassword, requestEcode } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.post('/forgot-password', forgotPassword); // Public route
router.post('/update-password', authMiddleware, updatePassword); // Protected route

router.post('/request-ecode', requestEcode); // Request an ecode


module.exports = router;
