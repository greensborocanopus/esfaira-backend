const express = require('express');
const router = express.Router();
const { getNotifications, acceptOrRejectLeagueRequest, acceptOrRejectTeamRequest } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is authenticated

router.get('/', authMiddleware, getNotifications);
router.post('/league-request', authMiddleware, acceptOrRejectLeagueRequest);
router.post('/team-request', authMiddleware, acceptOrRejectTeamRequest);


module.exports = router;
