const express = require("express");
const userController = require("../controllers/userController");
const { getTripsByUserId } = require("../controllers/userController");
const router = express.Router();
const {
  ensureAuthenticated,
  attachUserData,
} = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/all", ensureAuthenticated, userController.getAllUsers);

router.get("/:userId", getTripsByUserId);
// GET route to fetch user profile (requires authentication)
router.get("/profile", ensureAuthenticated, attachUserData, (req, res) => {
  res.json({ user: req.user }); // Return authenticated user data
});

// PUT route to update user profile (requires authentication)
router.put(
  "/profile",
  ensureAuthenticated,
  attachUserData,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { fullName, profileImage, bio } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, profileImage, bio },
        { new: true }
      );
      res.json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
