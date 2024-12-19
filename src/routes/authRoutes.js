const express = require('express');
const { login, register, forgotPassword, resetPasswordForm, resetPassword, updatePassword, requestEcode, verifyEcode, addEcode } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.post('/forgot-password', forgotPassword); // Public route
router.get('/reset-password-form', resetPasswordForm); 
router.post('/reset-password', resetPassword);
router.post('/update-password', authMiddleware, updatePassword); // Protected route

router.post('/add-ecode', authMiddleware, addEcode); // Add an ecode
router.post('/request-ecode', requestEcode); // Request an ecode
router.post('/verify-ecode', verifyEcode); // New ecode verification route


module.exports = router;
