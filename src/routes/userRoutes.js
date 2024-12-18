const express = require('express');
const { updateUser } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword

router.put('/update/:id', authMiddleware, updateUser);

module.exports = router;