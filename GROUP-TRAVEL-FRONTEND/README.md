# The Crew Canvas - Frontend Client 🎨🖥️

This is the frontend client codebase for **The Crew Canvas**, a collaborative travel planning single-page application built using React, Vite, Zustand, and Tailwind CSS.

---

## 🔗 Deployed URL
The client web app is deployed and running on **Vercel**:
`https://group-travel-itinerary-planner-one.vercel.app/`

---

## 🗺️ React Architecture & State Management

The application is structured as a component-driven Single Page Application (SPA). To manage global authentication status and trip datasets, it utilizes **Zustand** stores rather than complex Redux actions.

```
       ┌─────────────────────────────────────────────────────────┐
       │                       App.jsx                           │
       └──────────────────────────┬──────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                              ┌──────────────────┐
│  Public Routes   │                              │ Protected Routes │
└────────┬─────────┘                              └────────┬─────────┘
         │ (Landing/Login/Register)                        │ (Dashboard/TripDetails/Create)
         ▼                                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                    Zustand Stores (Global State)                   │
│         - authStore.js            - tripStore.js                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure

```
GROUP-TRAVEL-FRONTEND/
├── public/
├── src/
│   ├── components/            # Interface views & modular tabs
│   │   ├── CreateTrip.jsx     # Trip creation form
│   │   ├── Expenses.jsx       # Joint expenses tab pane
│   │   ├── Gallery.jsx        # Photo upload grid tab pane
│   │   ├── Home.jsx           # Dashboard viewing area
│   │   ├── Itinerary.jsx      # Timelines editor tab pane
│   │   ├── LandingPage.jsx    # General branding splash screen
│   │   ├── Login.jsx          # User authorization screen
│   │   ├── Navbar.jsx         # Responsive main menu controls
│   │   ├── Polls.jsx          # Voting lists tab pane
│   │   ├── ProtectedRoute.jsx # Session security guard wrapper
│   │   ├── Register.jsx       # Account creation screen
│   │   ├── TripDetails.jsx    # Primary trip details view
│   │   └── UserProfile.jsx    # Account details card
│   ├── store/                 # State stores
│   │   ├── authStore.js       # Current session and tokens
│   │   └── tripStore.js       # Trip collection lists
│   ├── App.jsx                # SPA Client router configuration
│   ├── index.css              # Custom Tailwind color themes
│   └── main.jsx               # React virtual DOM anchor
├── vercel.json                # Single page routes rewrites config
├── vite.config.js             # Vite configuration with tailwind plugin
├── package.json
└── README.md                  # Frontend documentation (this file)
```

---

## 🧠 Zustand State Management

### 1. Auth Store (`store/authStore.js`)
Handles registration, login validation, session tokens, and local cache backups.
-   **State**: `currentUser`, `token`, `isAuthenticated`, `loading`, `error`
-   **Actions**:
    -   `register(name, email, password)`: Post request to create user profile.
    -   `login(email, password)`: Post credentials and write token header on success.
    -   `logout()`: Clear browser storage tokens and reset state fields.

### 2. Trip Store (`store/tripStore.js`)
Tracks the current user's available travel itineraries.
-   **State**: `trips`, `selectedTrip`, `loading`, `error`
-   **Actions**:
    -   `getAllTrips()`: Pulls all canvases belonging to the active user.
    -   `getTrip(tripId)`: Populates organizers and members of the target trip.
    -   `createTrip(tripData)`: Posts a new canvas template.
    -   `deleteTrip(tripId)`: Removes specified trip.

---

## 🧭 Routing Structure

Client routes are handled by `react-router-dom`:
-   `/` (Public Splasher / Logged-in Dashboard) -> Renders `LandingPage` if anonymous, or `Home` dashboard if authenticated.
-   `/login` (Public) -> Authorization form.
-   `/register` (Public) -> Profile creation form.
-   `/profile` (Protected) -> Personal account details card.
-   `/create-trip` (Protected) -> New canvas planner.
-   `/trip/:tripId` (Protected) -> Detailed board mapping itineraries, polls, expenses, and media.

---

## 🔄 Core User Flows

### 🔑 Login Flow
1.  User enters credentials on `/login`.
2.  `authStore.login()` triggers a `POST` request to `/user-api/login`.
3.  Token is saved in `localStorage`, `isAuthenticated` is set to `true`, and the user is redirected to the home `/` dashboard.

### ⛺ Trip Creation Flow
1.  Authenticated user clicks "Create New Canvas".
2.  Fills out name, destination, dates, and click submit.
3.  `tripStore.createTrip()` submits data to `/trip-api/create-trip`.
4.  Backend registers trip, sets `createdBy` to current user, adds creator to `members` array automatically, and client redirects to `/`.

### 👥 Member Collaboration Flow
1.  Trip Organizer navigates to the detailed Trip Board (`/trip/:tripId`).
2.  Inputs user email in the "Add Member" widget and submits.
3.  Axios posts to `/trip-api/add-member/:tripId`.
4.  Backend finds user, validates permissions, pushes to members array, and client triggers updates.

---

## ⚙️ Environment Variables
Configure this variable in your `GROUP-TRAVEL-FRONTEND/.env` file:
```env
VITE_API_URL=http://localhost:5000
```
*Note: In production deployments, set this variable to point to the live Render backend URL.*

---

## 🚀 Execution & Command Reference

### Dependencies setup
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Compile Production Build Bundler
```bash
npm run build
```

---

## ☁️ Deployment Notes (Vercel hosting)
When deploying the React build to **Vercel**:
1.  Link your GitHub repository.
2.  Set the **Root Directory** setting to: `GROUP-TRAVEL-FRONTEND`.
3.  The build command (`npm run build`) and output directory (`dist`) are automatically detected.
4.  Add `VITE_API_URL` environment variable under Project Settings.
5.  **SPA Client Routing**: The root directory contains a [vercel.json](file:///c:/Users/puish/Desktop/GroupTravelItineraryPlanner/GROUP-TRAVEL-FRONTEND/vercel.json) file that maps all path requests back to `/index.html` to avoid 404 errors when reloading inner routes:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
