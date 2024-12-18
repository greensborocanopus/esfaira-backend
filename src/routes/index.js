const express = require('express');
const authRoutes = require('./authRoutes'); 
const leagueRoutes = require('./leagueRoutes');
const userRoutes = require('./userRoutes');
const apiRouter = express.Router();

// Define route prefixes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/league', leagueRoutes);
apiRouter.use('/user', userRoutes);

module.exports = apiRouter;
