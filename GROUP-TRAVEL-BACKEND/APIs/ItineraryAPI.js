import express from 'express';
import ItineraryModel from '../models/ItineraryModel.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /create-day - Create itinerary day for a trip (Protected)
router.post('/create-day', verifyToken, async (req, res) => {
  try {
    const { tripId, dayNumber, title, activities } = req.body;

    // Basic validation
    if (!tripId || dayNumber === undefined) {
      return res.status(400).json({ message: 'Trip ID and day number are required.' });
    }

    const newDay = new ItineraryModel({
      tripId,
      dayNumber,
      title,
      activities: activities || []
    });

    const savedDay = await newDay.save();
    res.status(201).json({ message: 'Itinerary day created successfully.', itinerary: savedDay });
  } catch (error) {
    res.status(500).json({ message: 'Server error during day creation.', error: error.message });
  }
});

// GET /trip/:tripId - Get all itinerary days for a trip (sorted by dayNumber ascending)
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    const itineraryDays = await ItineraryModel.find({ tripId }).sort({ dayNumber: 1 });
    res.status(200).json(itineraryDays);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching itinerary.', error: error.message });
  }
});

// PUT /add-activity/:itineraryId - Add activity string to activities array (Protected)
router.put('/add-activity/:itineraryId', verifyToken, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: 'Activity details are required.' });
    }

    const updatedItinerary = await ItineraryModel.findByIdAndUpdate(
      itineraryId,
      { $push: { activities: activity } },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary day not found.' });
    }

    res.status(200).json({ message: 'Activity added successfully.', itinerary: updatedItinerary });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding activity.', error: error.message });
  }
});

// DELETE /remove-activity/:itineraryId/:activityIndex - Remove activity by index (Protected)
router.delete('/remove-activity/:itineraryId/:activityIndex', verifyToken, async (req, res) => {
  try {
    const { itineraryId, activityIndex } = req.params;
    const index = parseInt(activityIndex, 10);

    const itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary day not found.' });
    }

    // Validate index boundaries
    if (isNaN(index) || index < 0 || index >= itinerary.activities.length) {
      return res.status(400).json({ message: 'Invalid activity index.' });
    }

    // Remove the activity at the given index
    itinerary.activities.splice(index, 1);
    await itinerary.save();

    res.status(200).json({ message: 'Activity removed successfully.', itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing activity.', error: error.message });
  }
});

// DELETE /delete-day/:itineraryId - Delete itinerary day (Protected)
router.delete('/delete-day/:itineraryId', verifyToken, async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const deletedItinerary = await ItineraryModel.findByIdAndDelete(itineraryId);
    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary day not found.' });
    }

    res.status(200).json({ message: 'Itinerary day deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting itinerary day.', error: error.message });
  }
});

export default router;
