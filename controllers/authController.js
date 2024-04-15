const User = require('../models/User');
const passport = require('passport');


// Register a new user
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Create a new user with email as the username
        const newUser = new User({ email: email });

        // Register the user with passport-local-mongoose
        await User.register(newUser, password);

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};



// Login user using passport-local strategy
exports.loginUser = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ error: 'Authentication failed' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ error: 'Login failed' });
            }
            return res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
};

// Logout user
exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.json({ message: "Logged out" });
    });
};

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized access' });
};
