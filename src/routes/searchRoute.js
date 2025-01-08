const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { globalSearch } = require('../controllers/searchController');

const router = express.Router();

router.post('/', authMiddleware, globalSearch);

module.exports = router;