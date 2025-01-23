const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { searchOrganization, addOrganization, getOrganizations } = require('../controllers/organizationController');

router.get('/searchOrganization', authMiddleware, searchOrganization);
router.post('/add', authMiddleware, addOrganization);
router.get('/all', getOrganizations)

module.exports = router;
