import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  activities: [{
    type: String,
  }]
}, { timestamps: true });

const ItineraryModel = mongoose.model('Itinerary', itinerarySchema);

export default ItineraryModel;
