const express = require('express');
const { createTeam, getTeams, getTeamById, getTeamsBySubleague, requestToJoinTeam } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/subleague', authMiddleware, getTeamsBySubleague);
router.post('/join-request', authMiddleware, requestToJoinTeam);
router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);



module.exports = router;