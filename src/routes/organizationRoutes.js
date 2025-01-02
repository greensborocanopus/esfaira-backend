const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword
const { searchOrganization } = require('../controllers/organizationController');

router.get('/searchOrganization', searchOrganization);
module.exports = router;
