const express = require('express');
const { createTeam, getTeams, getTeamById } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);

module.exports = router;