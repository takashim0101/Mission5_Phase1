// auction-api/server.js

// Import the Express library to create and configure the web server.
const express = require('express');
// Import the Mongoose library for connecting to MongoDB and interacting with the database.
const mongoose = require('mongoose');
// Import the dotenv library to load environment variables from a .env file.
const dotenv = require('dotenv');
// Import the auction routes defined in './routes/auctions.js'.
// These routes define the API endpoints for auction-related operations.
const auctionRoutes = require('./routes/auctions');

// Load environment variables from the .env file.
// This makes variables like `process.env.MONGO_URI` available throughout the application.
dotenv.config();

// Create an instance of the Express application.
// This 'app' object will be used to set up middleware, define routes, and start the server.
const app = express();

// --- Middleware ---
// Middleware functions are functions that have access to the request object (req),
// the response object (res), and the next middleware function in the application’s
// request-response cycle.

// Use express.json() middleware.
// This built-in middleware parses incoming JSON requests and puts the parsed data
// into `req.body`. It's essential for handling JSON payloads sent by clients.
app.use(express.json());

// --- MongoDB Connection ---
// Connect to the MongoDB database using Mongoose.
// The connection URI is typically stored in an environment variable for security and flexibility.
mongoose.connect(process.env.MONGO_URI)
  // If the connection is successful, log a success message to the console.
  .then(() => console.log('MongoDB connected successfully'))
  // If an error occurs during connection, log the error to the console.
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
// Mount the auctionRoutes router at the '/api/auctions' path.
// Any requests starting with '/api/auctions' will be handled by the auctionRoutes.
// For example, a GET request to '/api/auctions/' will be handled by the '/' route
// defined within auctionRoutes.
app.use('/api/auctions', auctionRoutes);

// --- Error Handling Middleware (optional, add as needed) ---
// This is an example of an error handling middleware. It has four arguments:
// (err, req, res, next). Express recognizes this signature as an error handler.
app.use((err, req, res, next) => {
  // Log the error stack trace to the console for debugging purposes.
  console.error(err.stack);
  // Send a generic 500 Internal Server Error response to the client.
  // In a production environment, you might want to send more specific or less verbose errors.
  res.status(500).send('Something broke!');
});

// Export the Express app instance.
// This allows other files (like index.js) to import and use this configured Express application,
// for example, to start the server or for testing purposes with Supertest.
module.exports = app;