const User = require("../models/User");

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
