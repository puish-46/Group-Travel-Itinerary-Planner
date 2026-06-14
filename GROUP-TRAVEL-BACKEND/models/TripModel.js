import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true });

const TripModel = mongoose.model('Trip', tripSchema);

export default TripModel;
