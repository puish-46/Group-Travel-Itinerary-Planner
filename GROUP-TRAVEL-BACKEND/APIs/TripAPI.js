import express from 'express';
import TripModel from '../models/TripModel.js';
import verifyToken from '../middlewares/verifyToken.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// POST /create-trip - Create a new trip (Protected)
router.post('/create-trip', verifyToken, async (req, res) => {
  try {
    const { tripName, destination, description, startDate, endDate, members } = req.body;

    // Basic validation
    if (!tripName || !destination || !startDate || !endDate) {
      return res.status(400).json({ message: 'Trip name, destination, start date, and end date are required.' });
    }

    const creatorId = req.user.id;

    // Ensure the creator is included in members
    let tripMembers = Array.isArray(members) ? members : [];
    if (!tripMembers.includes(creatorId)) {
      tripMembers.push(creatorId);
    }

    const newTrip = new TripModel({
      tripName,
      destination,
      description,
      startDate,
      endDate,
      createdBy: creatorId,
      members: tripMembers
    });

    const savedTrip = await newTrip.save();
    res.status(201).json({ message: 'Trip created successfully.', trip: savedTrip });
  } catch (error) {
    res.status(500).json({ message: 'Server error during trip creation.', error: error.message });
  }
});

// GET /all-trips - Get all trips for the logged-in user (Protected)
router.get('/all-trips', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await TripModel.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all trips.', error: error.message });
  }
});

// GET /trip/:tripId - Get single trip by ID (Protected)
router.get('/trip/:tripId', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const trip = await TripModel.findById(tripId)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Verify if user is creator or in members list
    const isCreator = trip.createdBy._id.toString() === userId;
    const isMember = trip.members.some(member => member._id.toString() === userId);

    if (!isCreator && !isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this trip.' });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching trip details.', error: error.message });
  }
});

// DELETE /delete-trip/:tripId - Delete trip (Protected, only creator can delete)
router.delete('/delete-trip/:tripId', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await TripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Verify if the current user is the creator of the trip
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. Only the trip creator can delete this trip.' });
    }

    await TripModel.findByIdAndDelete(tripId);
    res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during trip deletion.', error: error.message });
  }
});

// POST /add-member/:tripId - Add a member to a trip (Protected, only creator can add)
router.post('/add-member/:tripId', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;
    const userId = req.user.id;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Only trip creator can add members
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. Only the trip creator can add members.' });
    }

    // Find user by email
    const userToAdd = await UserModel.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }

    // If already member return error
    if (trip.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of this trip.' });
    }

    // Add user's _id to trip members array
    trip.members.push(userToAdd._id);
    await trip.save();

    res.status(200).json({ message: 'Member added successfully.', members: trip.members });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding member.', error: error.message });
  }
});

export default router;
