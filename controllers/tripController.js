const Trip = require('../models/Trip');

// Get all trips for a specific user
exports.getTrips = async (req, res) => {
    const userId = req.params.userId;
    try {
        const trips = await Trip.find({ userId });
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

// Create a new trip
exports.createTrip = async (req, res) => {
    const { userId, title, location, startDate, endDate } = req.body;
    try {
        const newTrip = new Trip({ userId, title, location, startDate, endDate });
        await newTrip.save();
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
