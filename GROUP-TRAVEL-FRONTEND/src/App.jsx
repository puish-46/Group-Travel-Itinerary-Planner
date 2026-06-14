import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CreateTrip from './components/CreateTrip.jsx';
import TripDetails from './components/TripDetails.jsx';
import Itinerary from './components/Itinerary.jsx';
import Polls from './components/Polls.jsx';
import Expenses from './components/Expenses.jsx';
import Gallery from './components/Gallery.jsx';
import UserProfile from './components/UserProfile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/trip/:tripId" element={<TripDetails />} />
              <Route path="/trip/:tripId/itinerary" element={<Itinerary />} />
              <Route path="/trip/:tripId/polls" element={<Polls />} />
              <Route path="/trip/:tripId/expenses" element={<Expenses />} />
              <Route path="/trip/:tripId/gallery" element={<Gallery />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;