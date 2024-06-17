const User = require("../models/User");
const Trip = require("../models/Trip");
const { attachUserData } = require("../middleware/authMiddleware");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("trips"); // Populate trips
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getTripsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const trips = await Trip.find({ userId });

    if (!trips) {
      return res.status(404).json({ error: "Trips not found for this user" });
    }

    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips by user ID:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};
// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    res.json(user); // Return user profile data from attached user object
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { user } = req;
    const updateData = req.body;

    // Update user profile data based on attached user object
    const updatedUser = await User.findByIdAndUpdate(
      user._id, // Use user ID from attached user object
      updateData,
      { new: true }
    );

    res.json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

module.exports = exports;
