const express = require('express');
const { getUnusedEcode, getEcode, login, register, forgotPassword, resetPasswordForm, resetPassword, resetPasswordSuccess, invalidToken,  updatePassword, requestEcode, verifyEcode, addEcode } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', login);
router.post('/register', upload.single('photo'), register);

router.post('/forgot-password', forgotPassword); // Public route
router.get('/reset-password-form', resetPasswordForm); 
router.post('/reset-password', resetPassword);
router.get('/reset-password-success', resetPasswordSuccess);
router.get('/invalid-token', invalidToken);
router.post('/update-password', authMiddleware, updatePassword); // Protected route

router.post('/add-ecode', addEcode); // Add an ecode
router.post('/request-ecode', requestEcode); // Request an ecode
router.post('/verify-ecode', verifyEcode); // New ecode verification route
router.get('/ecode', getEcode); // New ecode verification route
router.get('/unused-ecode', getUnusedEcode); // New ecode verification route

module.exports = router;
