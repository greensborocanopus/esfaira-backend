const express = require('express');
const { createTeam, getTeams, getTeamById, getTeamsBySubleague, requestToJoinTeam, getTeamsBySubleagueId, updateStatus, getJoinedTeams, updatePlayerStatus } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/subleague', authMiddleware, getTeamsBySubleague);
router.post('/status', authMiddleware, updateStatus);
router.get('/subleague/:sub_league_id', authMiddleware, getTeamsBySubleagueId);
router.post('/join-request', authMiddleware, requestToJoinTeam);
router.get('/team-invitation', authMiddleware, getJoinedTeams);
router.post('/team-status', authMiddleware, updatePlayerStatus);

router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);



module.exports = router;