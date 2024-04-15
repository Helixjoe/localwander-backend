// Error handling middleware for Express.js

// Middleware function to handle and respond to errors
exports.handleErrors = (err, req, res, next) => {
    console.error('An error occurred:', err);

    // Determine the status code and error message based on the type of error
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || 'Internal Server Error';

    // Send an error response with the appropriate status code and error message
    res.status(statusCode).json({ error: errorMessage });
};

// Middleware function to handle 404 (Not Found) errors
exports.handleNotFound = (req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
};
