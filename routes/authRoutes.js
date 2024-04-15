const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/authMiddleware');

// Register route
router.post('/register', ensureNotAuthenticated, authController.registerUser);

// Login route
router.post('/login', ensureNotAuthenticated, authController.loginUser);

// Logout route
router.get('/logout', ensureAuthenticated, authController.logoutUser);

module.exports = router;
