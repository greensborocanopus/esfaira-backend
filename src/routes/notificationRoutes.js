const express = require('express');
const router = express.Router();
const { getNotifications, acceptOrRejectLeagueRequest } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is authenticated

router.get('/', authMiddleware, getNotifications);
router.post('/accept-or-reject', authMiddleware, acceptOrRejectLeagueRequest);

module.exports = router;
