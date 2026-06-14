import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

// Import routers (ES modules require the file extension for local imports)
import userApp from './APIs/UserAPI.js';
import tripApp from './APIs/TripAPI.js';
import itineraryApp from './APIs/ItineraryAPI.js';
import pollApp from './APIs/PollAPI.js';
import expenseApp from './APIs/ExpenseAPI.js';
import galleryApp from './APIs/GalleryAPI.js';

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Database.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Database:', error.message);
  });

// Mount routers
app.use('/user-api', userApp);
app.use('/trip-api', tripApp);
app.use('/itinerary-api', itineraryApp);
app.use('/poll-api', pollApp);
app.use('/expense-api', expenseApp);
app.use('/gallery-api', galleryApp);

// Default route
app.get('/', (req, res) => {
  res.send({ message: "Welcome to Group Travel Itinerary Planner API" });
});

// Express error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: "An error occurred", error: err.message });
});

// Port configuration and Server Activation
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
