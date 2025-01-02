const express = require('express');
const { getSubleagues, addLeague, updateLeague, getSubleagueById, addSubleague } = require('../controllers/leagueController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword

router.post('/add', authMiddleware, addLeague); // Add a new league
router.put('/update/:id', authMiddleware, updateLeague); // Route to update a league
router.get('/', getSubleagues);
router.get('/subLeague/:id', getSubleagueById);
router.post('/subLeague', addSubleague);
module.exports = router;
