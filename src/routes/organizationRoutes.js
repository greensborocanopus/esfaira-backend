const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { searchOrganization, addOrganization } = require('../controllers/organizationController');

router.get('/searchOrganization', searchOrganization);
router.post('/add', authMiddleware, addOrganization);

module.exports = router;
