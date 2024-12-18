const express = require('express');
const authRoutes = require('./authRoutes'); // Import auth routes
const apiRouter = express.Router();

// Define route prefixes
apiRouter.use('/auth', authRoutes);

module.exports = apiRouter;
