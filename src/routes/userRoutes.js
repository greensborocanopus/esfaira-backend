const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { updateUser, addCountry, addState, addCity, getCountries, getStates, getCities, getCountryById, getStateById, getCityById } = require('../controllers/userController');

router.put('/update/:id', authMiddleware, updateUser);

router.post('/add-country', addCountry); // Add a new country
router.post('/add-state', addState);     // Add a new state
router.post('/add-city', addCity);       // Add a new city

router.get('/countries', getCountries); // Fetch all countries
router.get('/states', getStates); // Fetch all states
router.get('/cities', getCities); // Fetch all cities

router.get('/country', getCountryById); // Fetch a single country by ID
router.get('/state', getStateById); // Fetch a single state by ID
router.get('/city', getCityById); // Fetch a single city by ID

module.exports = router;