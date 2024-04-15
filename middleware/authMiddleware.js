// Import necessary modules
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    // User is not authenticated, redirect to login or return an error response
    res.status(401).json({ error: 'Unauthorized access' });
};

// Middleware to check if user is not authenticated (for login/register routes)
exports.ensureNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(); // User is not authenticated, proceed to the next middleware/route handler
    }
    // User is already authenticated, redirect to dashboard or return an error response
    res.status(403).json({ error: 'User is already authenticated' });
};

// Middleware to fetch and attach user data to the request object
exports.attachUserData = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userId = req.user.id; // Extract user ID from authenticated session
        try {
            const user = await User.findById(userId);
            if (user) {
                req.user = user; // Attach user data to the request object for use in route handlers
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    next(); // Proceed to the next middleware/route handler
};

