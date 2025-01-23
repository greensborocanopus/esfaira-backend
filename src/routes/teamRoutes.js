const express = require('express');
const { getAcceptedTeamsBySubleagueId, createTeam, getTeams, getTeamById, getTeamsBySubleague, requestToJoinTeam, getTeamsBySubleagueId, updateStatus, getJoinedTeams, updatePlayerStatus, getPlayersByTeam, getAllPlayers } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/subleague', authMiddleware, getTeamsBySubleague);
router.post('/status', authMiddleware, updateStatus);
router.get('/subleague/:sub_league_id', authMiddleware, getTeamsBySubleagueId);
router.get('/joined-subleague/:sub_league_id', authMiddleware, getAcceptedTeamsBySubleagueId);
router.post('/join-request', authMiddleware, requestToJoinTeam);
router.get('/team-invitation', authMiddleware, getJoinedTeams);
router.post('/team-status', authMiddleware, updatePlayerStatus);
router.get('/players', getAllPlayers);
router.get('/player/:id', getPlayersByTeam);

router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);



module.exports = router;