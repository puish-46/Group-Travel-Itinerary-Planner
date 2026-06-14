# The Crew Canvas - Backend REST API 🚀

This is the backend server codebase for **The Crew Canvas**, built using Node.js, Express.js, and MongoDB. The server handles authentication, session validation, route access control checks, database query manipulation, and Cloudinary media uploads.

---

## 🔗 Deployed URL
The backend is deployed and running on **Render**:
`https://group-travel-itinerary-planner-plwh.onrender.com`

---

## 🗺️ API Architecture

The backend operates as an Express application exposing HTTP/JSON endpoints. Database communication is structured using Mongoose models. Critical state operations are protected using JSON Web Tokens (JWT) verified via middleware.

```
                  ┌──────────────────────┐
                  │   HTTP client req    │
                  └──────────┬───────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │ verifyToken.js    │ (JWT Middleware Gate)
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │    Route Handler  │ (APIs/ controller files)
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │   Mongoose model  │
                   └───────────────────┘
```

---

## 📂 Folder Structure

```
GROUP-TRAVEL-BACKEND/
├── APIs/                  # Express routes and controller handlers
│   ├── UserAPI.js         # User registration, login, and profile info
│   ├── TripAPI.js         # Trip canvases and member administration
│   ├── ItineraryAPI.js    # Day schedules and activities updates
│   ├── PollAPI.js         # Group polls and voting options
│   ├── ExpenseAPI.js      # Travel bills and equal shares calculations
│   └── GalleryAPI.js      # Photo uploads and Cloudinary integration
├── Models/                # Mongoose database schema definitions
│   ├── User.js
│   ├── Trip.js
│   ├── Itinerary.js
│   ├── Poll.js
│   ├── Expense.js
│   └── GalleryPhoto.js
├── Middlewares/           # Routing middleware
│   └── verifyToken.js     # JWT extraction and validation filter
├── db.js                  # Mongoose MongoDB Atlas connection handler
├── server.js              # Server bootstrapper
├── package.json
└── README.md              # Backend documentation (this file)
```

---

## 🔒 Middlewares & Authentication

### JWT Authorization Gate
Authorization is implemented using a custom middleware [verifyToken.js](file:///c:/Users/puish/Desktop/GroupTravelItineraryPlanner/GROUP-TRAVEL-BACKEND/Middlewares/verifyToken.js).
-   The client transmits the generated session token in the header format: `Authorization: Bearer <JWT_TOKEN>`.
-   The middleware extracts the token, verifies the signature against the server's local `JWT_SECRET`, and mounts the decoded payload user data (`req.currentUser`) onto the request object.
-   Protected routes return a `401 Unauthorized` response if the token is missing or expired, or a `403 Forbidden` if the logged-in user is not part of the destination canvas.

---

## 🗄️ Database Models (Schemas)

### 1. User
-   `name`: String (Required)
-   `email`: String (Required, Unique)
-   `password`: String (Required, minimum 6 characters)
-   `role`: String (Default: 'user')

### 2. Trip
-   `tripName`: String (Required)
-   `destination`: String (Required)
-   `description`: String
-   `startDate`: Date (Required)
-   `endDate`: Date (Required)
-   `createdBy`: Reference to `User` (Required)
-   `members`: Array of References to `User` (Pre-populated)

### 3. Itinerary
-   `tripId`: Reference to `Trip` (Required)
-   `dayNumber`: Number (Required)
-   `title`: String
-   `activities`: Array of Strings

### 4. Poll
-   `tripId`: Reference to `Trip` (Required)
-   `question`: String (Required)
-   `options`: Array of Objects `{ text: String, votes: Number }`
-   `voters`: Array of Objects `{ userId: Reference to User, optionIndex: Number }`
-   `createdBy`: Reference to `User` (Required)

### 5. Expense
-   `tripId`: Reference to `Trip` (Required)
-   `title`: String (Required)
-   `amount`: Number (Required)
-   `paidBy`: Reference to `User` (Required)
-   `participants`: Array of References to `User`

### 6. GalleryPhoto
-   `tripId`: Reference to `Trip` (Required)
-   `imageUrl`: String (Required, Cloudinary host)
-   `uploadedBy`: Reference to `User` (Required)

---

## 🛣️ API Endpoints Reference

### 👤 User Routes (`/user-api`)
-   `POST /user-api/register` - Create a new user profile.
-   `POST /user-api/login` - Authenticate credentials, returns session token.
-   `GET /user-api/profile` - Retrieve current user profile details *(Protected)*.

### ⛺ Trip Routes (`/trip-api`)
-   `POST /trip-api/create-trip` - Register a new trip. The creator is automatically added as member *(Protected)*.
-   `GET /trip-api/all-trips` - Retrieve trips where current user is creator or member *(Protected)*.
-   `GET /trip-api/trip/:tripId` - Read trip settings and populate details *(Protected)*.
-   `DELETE /trip-api/trip/:tripId` - Delete specific trip canvas. Only trip creators can delete *(Protected)*.
-   `POST /trip-api/add-member/:tripId` - Add travel member by email. Only trip creators can add members *(Protected)*.

### 📅 Itinerary Routes (`/itinerary-api`)
-   `GET /itinerary-api/trip/:tripId` - Read itinerary days list.
-   `POST /itinerary-api/create-day` - Create new day block *(Protected)*.
-   `DELETE /itinerary-api/delete-day/:itineraryId` - Delete day schedule *(Protected)*.
-   `PUT /itinerary-api/add-activity/:itineraryId` - Append action task to day's timeline *(Protected)*.
-   `DELETE /itinerary-api/remove-activity/:itineraryId/:activityIndex` - Remove action task from day *(Protected)*.

### 📊 Poll Routes (`/poll-api`)
-   `GET /poll-api/trip/:tripId` - Read active poll options list.
-   `POST /poll-api/create-poll` - Construct a new poll questionnaire *(Protected)*.
-   `PUT /poll-api/vote/:pollId` - Register single user option vote *(Protected)*.
-   `DELETE /poll-api/delete-poll/:pollId` - Destroy existing poll *(Protected)*.

### 💰 Expense Routes (`/expense-api`)
-   `GET /expense-api/trip/:tripId` - Read logged expenses list.
-   `GET /expense-api/summary/:tripId` - Calculate total costs and individual split headshares.
-   `POST /expense-api/create-expense` - Log new bill transaction *(Protected)*.
-   `DELETE /expense-api/delete-expense/:expenseId` - Delete expense transaction *(Protected)*.

### 📸 Gallery Routes (`/gallery-api`)
-   `GET /gallery-api/trip/:tripId` - Read gallery photos list.
-   `POST /gallery-api/upload` - Process local image files via Multer and store in Cloudinary cloud *(Protected)*.
-   `DELETE /gallery-api/delete/:photoId` - Remove image from cloud and collection *(Protected)*.

---

## ⚙️ Environment Variables
Configure these variables in your `GROUP-TRAVEL-BACKEND/.env` file:
```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Execution & Command Reference

### Dependencies setup
```bash
npm install
```

### Start Server in Development Mode (with hot-reloading)
```bash
npm run dev
```

### Start Server in Production Mode
```bash
npm start
```

---

## ☁️ Deployment Notes (Render hosting)
When hosting the API server on **Render**:
1.  Connect your GitHub repository.
2.  Set the **Root Directory** setting to: `GROUP-TRAVEL-BACKEND`.
3.  Set the **Build Command** setting to: `npm install`.
4.  Set the **Start Command** setting to: `npm start`.
5.  Add all environment variables (`DB_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) under Render's Environment settings.
