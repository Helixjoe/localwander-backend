const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes');
const { ensureAuthenticated, attachUserData } = require('./middleware/authMiddleware');
const { handleErrors } = require('./middleware/errorMiddleware');
const db = require('./config/database');


// Set up session middleware
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
require('./config/passport'); // Import Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // Authentication routes

// Trips Routes (protected by authentication middleware)
app.use('/trips', ensureAuthenticated, attachUserData, tripRoutes);

// User Routes (protected by authentication middleware)
app.use('/users', ensureAuthenticated, attachUserData, userRoutes);

// Error handling middleware
app.use(handleErrors);

app.listen(3000, () => { console.log('Server is running on port 3000'); });

module.exports = app;
