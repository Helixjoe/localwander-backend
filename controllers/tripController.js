const Trip = require("../models/Trip");
const User = require("../models/User");
// Helper function to calculate duration
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end - start);
  const duration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Round up to ensure the whole duration is covered
  return duration;
};

const calculateTotalExpense = (trip) => {
  let totalExpense = 0;

  // Iterate over each day
  for (const day of trip.days) {
    // Add the day's expense
    totalExpense += Number(day.expense) || 0;
  }

  return totalExpense;
};

// Get all trips for the current authenticated user
exports.getTripsByUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const userId = req.user._id;
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

// Get trip by ID
exports.getTripById = async (req, res) => {
  const { tripid } = req.params;

  try {
    const trip = await Trip.findById(tripid);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  const { title, days, startDate, endDate, privateTrip } = req.body;
  const userId = req.user._id;
  expense = 0;

  try {
    const overlappingTrips = await Trip.find({
      userId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
      ],
    });

    if (overlappingTrips.length > 0) {
      const overlappingTripDetails = overlappingTrips.map((trip) => ({
        title: trip.title,
      }));
      return res.status(400).json({
        error: "The new trip overlaps with existing trips",
        overlappingTrips: overlappingTripDetails,
      });
    }

    const duration = calculateDuration(startDate, endDate);
    const newTrip = new Trip({
      userId,
      title,
      days,
      startDate,
      endDate,
      duration,
      expense,
      privateTrip,
    });

    await newTrip.save();
    await User.findByIdAndUpdate(userId, { $push: { trips: newTrip._id } });
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
    // Validate the input data
    if (!updateData.title || !updateData.startDate || !updateData.endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate duration if dates are present
    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      updateData.duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    }

    const totalExpense = calculateTotalExpense(updateData);
    updateData.expense = totalExpense;

    // Ensure travel arrays exist
    if (updateData.days) {
      updateData.days.forEach((day) => {
        if (!day.travel) {
          day.travel = [];
        }
      });
    }

    // Find and update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, {
      new: true,
    });

    // If trip not found
    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

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
