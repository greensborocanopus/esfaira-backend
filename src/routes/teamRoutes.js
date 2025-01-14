const express = require('express');
const { createTeam, getTeams, getTeamById, getTeamsBySubleague, requestToJoinTeam, getTeamsBySubleagueId } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/subleague', authMiddleware, getTeamsBySubleague);
router.get('/subleague/:sub_league_id', authMiddleware, getTeamsBySubleagueId);
router.post('/join-request', authMiddleware, requestToJoinTeam);
router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);



module.exports = router;