const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
// Route to get all trips for a specific user
router.get("/show", ensureAuthenticated, tripController.getTripsByUser);

// Route to create a new trip
router.post("/create", ensureAuthenticated, tripController.createTrip);

// Route to update an existing trip
router.put("/edit/:tripId", ensureAuthenticated, tripController.updateTrip);

// Route to delete a trip
router.delete(
  "/delete/:tripId",
  ensureAuthenticated,
  tripController.deleteTrip
);

router.get("/show/:tripid", ensureAuthenticated, tripController.getTripById);

router.get("/all", ensureAuthenticated, tripController.getAllTrips);

module.exports = router;
