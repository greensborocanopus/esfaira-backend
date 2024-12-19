const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { updateUser, addCountry, addState, addCity } = require('../controllers/userController');

router.put('/update/:id', authMiddleware, updateUser);
router.post('/add-country', addCountry); // Add a new country
router.post('/add-state', addState);     // Add a new state
router.post('/add-city', addCity);       // Add a new city

module.exports = router;