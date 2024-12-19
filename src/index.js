const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes'); // Import the main router
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Configure CORS
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend's URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // Allow credentials (e.g., cookies, authorization headers)
// }));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded form data

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
