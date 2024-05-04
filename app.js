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
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS (production)
      sameSite: 'strict', // Strict mode for better security
    },
}));

require('./config/passport'); // Import Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow sending cookies with the request
}));
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
