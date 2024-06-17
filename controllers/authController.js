const User = require("../models/User");
const passport = require("passport");

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user with email as the username
    const newUser = new User({ email: email });

    // Register the user with passport-local-mongoose
    await User.register(newUser, password);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user using passport-local strategy

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Login successful" });
    });
  })(req, res, next);
};

// Logout user
exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out" });
  });
};

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized access" });
};

exports.addTripsToUser = async (req, res) => {
  const { userId, tripIds } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.trips = user.trips.concat(tripIds);
    await user.save();

    res.json({ message: "Trips added to user successfully", user });
  } catch (error) {
    console.error("Error adding trips to user:", error);
    res.status(500).json({ error: "Failed to add trips to user" });
  }
};
