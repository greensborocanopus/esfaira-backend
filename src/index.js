const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes'); // Import the main router
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
