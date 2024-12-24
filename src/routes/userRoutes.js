const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { getUser, updateUser, addCountry, addState, addCity, getCountries, getStates, getCities, getCountryById, getStateById, getCityById, getStateByCountry, getCityByState } = require('../controllers/userController');

router.get('/', getUser);
router.put('/update/:id', authMiddleware, updateUser);

router.post('/add-country', addCountry); // Add a new country
router.post('/add-state', addState);     // Add a new state
router.post('/add-city', addCity);       // Add a new city

router.get('/allCountries', getCountries); // Fetch all countries
router.get('/allStates', getStates); // Fetch all states
router.get('/allCities', getCities); // Fetch all cities

router.get('/country', getCountryById); // Fetch a single country by ID
router.get('/state', getStateById); // Fetch a single state by ID
router.get('/city', getCityById); // Fetch a single city by ID

router.get('/states/:countryId', getStateByCountry); // Fetch states by country
router.get('/cities/:stateId', getCityByState); // Fetch cities by state

module.exports = router;