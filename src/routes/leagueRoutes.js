const express = require('express');
const { getAllSubLeagues, getAllLeagues, searchPlayer, getJoinLeague, getSubleagues, addLeague, updateLeague, getSubleagueById, addSubleague, getLeagues, joinLeague} = require('../controllers/leagueController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is logged in for updatePassword

router.post('/add', authMiddleware, addLeague); // Add a new league
router.put('/update/:id', authMiddleware, updateLeague); // Route to update a league
router.get('/', authMiddleware, getSubleagues);
router.get('/subLeague/:id',authMiddleware, getSubleagueById);
router.post('/subLeague', authMiddleware, addSubleague);
router.get('/searchLeague', getLeagues);
router.post('/join-league', authMiddleware, joinLeague);
router.get('/joined-leagues', authMiddleware, getJoinLeague);
router.post('/search-player', searchPlayer);
router.get('/all-leagues', getAllLeagues);
router.get('/all-subleagues', getAllSubLeagues);


module.exports = router;
