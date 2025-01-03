const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // To differentiate between expected and unexpected errors
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (err, res) => {
    // Log error details (use a logger in production, e.g., Winston or Bunyan)
    console.error('Error:', err);

    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'production' ? { stack: err.stack } : {}), // Include stack trace only in development
    });
};

module.exports = { AppError, handleError };
