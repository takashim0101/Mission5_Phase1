// auction-api/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auctionRoutes = require('./routes/auctions'); // Import routes

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create Express app instance

// Middleware
app.use(express.json()); // JSON body parser

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI) // Removed deprecated options
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auctions', auctionRoutes);

// Error Handling Middleware (optional, add as needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the Express app instance
module.exports = app;

// Server startup should be handled in a separate file (e.g., index.js)
// or conditional logic (e.g., if (require.main === module) { app.listen(...) })
// For testing with Supertest, we pass the 'app' instance directly,
// so it doesn't need to be listening on a port for tests.
// For normal development/production, you'll need an 'index.js' or similar.
/*
// Example for auction-api/index.js (new file for server startup):
const app = require('./server'); // Import Express app from server.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api/auctions`);
  console.log(`Access search API at http://localhost:${PORT}/api/auctions/search?keyword=your_keyword`);
});
*/