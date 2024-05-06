const Trip = require("../models/Trip");

// Get all trips for the current authenticated user
exports.getTripsByUser = async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    // Extract userId from the authenticated user object (assuming userId is stored as _id)
    const userId = req.user._id; // Assuming userId is stored as _id

    // Find all trips associated with the userId
    const trips = await Trip.find({ userId });

    // Respond with the found trips
    res.json(trips);
    console.log(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

exports.getTripById = async (req, res) => {
  const { tripid } = req.params;

  try {
    // Find trip by ID
    const trip = await Trip.findById(tripid);

    // If trip is not found, return 404 status code
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Respond with the found trip
    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  const { title, location, startDate, endDate } = req.body;
  const userId = req.user._id; // Adjust this based on your actual user schema

  try {
    // Check for overlapping trips
    const overlappingTrips = await Trip.find({
      userId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Trip starts before or ends after the new trip
        { startDate: { $gte: startDate, $lte: endDate } }, // Trip starts during the new trip
        { endDate: { $gte: startDate, $lte: endDate } }, // Trip ends during the new trip
      ],
    });

    // If overlapping trips exist, respond with an error message and details of overlapping trips
    if (overlappingTrips.length > 0) {
      const overlappingTripDetails = overlappingTrips.map((trip) => ({
        title: trip.title,
      }));
      return res.status(400).json({
        error: "The new trip overlaps with existing trips",
        overlappingTrips: overlappingTripDetails,
      });
    }

    // Calculate the duration in milliseconds
    const durationInMs = new Date(endDate) - new Date(startDate);

    // Convert duration from milliseconds to days
    const duration = durationInMs / (1000 * 60 * 60 * 24);

    // Create a new trip with the extracted userId
    const newTrip = new Trip({
      userId,
      title,
      location,
      startDate,
      endDate,
      duration,
    });

    // Save the new trip to the database
    await newTrip.save();

    // Respond with success message and created trip data
    res.json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

// Update an existing trip
exports.updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const updateData = req.body;
  try {
    // Check for overlapping trips
    const overlappingTrips = await Trip.find({
      _id: { $ne: tripId }, // Exclude the current trip from overlapping check
      userId: updateData.userId, // Assuming userId is included in updateData
      $or: [
        {
          startDate: { $lte: updateData.endDate },
          endDate: { $gte: updateData.startDate },
        }, // Trip starts before or ends after the updated trip
        { startDate: { $gte: updateData.startDate, $lte: updateData.endDate } }, // Trip starts during the updated trip
        { endDate: { $gte: updateData.startDate, $lte: updateData.endDate } }, // Trip ends during the updated trip
      ],
    });

    // If overlapping trips exist, respond with an error message and details of overlapping trips
    if (overlappingTrips.length > 0) {
      const overlappingTripDetails = overlappingTrips.map((trip) => ({
        title: trip.title,
      }));
      return res.status(400).json({
        error: "The updated trip overlaps with existing trips",
        overlappingTrips: overlappingTripDetails,
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, {
      new: true,
    });
    res.json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Failed to update trip" });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    await Trip.findByIdAndDelete(tripId);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};
