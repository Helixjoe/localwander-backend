const Trip = require('../models/Trip');


// Get all trips for the current authenticated user
exports.getTripsByUser = async (req, res) => {
    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Extract userId from the authenticated user object (assuming userId is stored as _id)
        const userId = req.user._id; // Assuming userId is stored as _id

        // Find all trips associated with the userId
        const trips = await Trip.find({ userId });

        // Respond with the found trips
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

// Create a new trip
exports.createTrip = async (req, res) => {
    const { title, location, startDate, endDate } = req.body;

    // Extract userId from the authenticated user object (assuming userId is a field in req.user)
    const userId = req.user._id; // Adjust this based on your actual user schema

    try {
        // Create a new trip with the extracted userId
        const newTrip = new Trip({ userId, title, location, startDate, endDate });

        // Save the new trip to the database
        await newTrip.save();

        // Respond with success message and created trip data
        res.json({ message: 'Trip created successfully', trip: newTrip });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

// Update an existing trip
exports.updateTrip = async (req, res) => {
    const { tripId } = req.params;
    const updateData = req.body;
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, { new: true });
        res.json({ message: 'Trip updated successfully', trip: updatedTrip });
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Failed to update trip' });
    }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
    const { tripId } = req.params;
    try {
        await Trip.findByIdAndDelete(tripId);
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
};
