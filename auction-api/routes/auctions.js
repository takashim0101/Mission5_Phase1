// auction-api/routes/auctions.js

// Import the Express library to create a router.
const express = require('express');
const router = express.Router(); // Create a new router object to handle routes.

// Import the Mongoose model for AuctionItem.
// This model is used to interact with the 'auctions' collection in MongoDB.
const AuctionItem = require('../models/AuctionItem');

// Import the validation function for search queries.
// This function is used to validate incoming request parameters for search operations.
const { validateSearchAuction } = require('../validation/auctionValidation');

// Route to get all auction items.
// This handles GET requests to the root path of this router, which typically
// translates to GET /api/auctions if this router is mounted at '/api/auctions'.
router.get('/', async (req, res) => {
  try {
    // Fetch all documents from the 'auctions' collection.
    // The .find({}) method without any arguments retrieves all items.
    const items = await AuctionItem.find({});

    // Map the fetched items to a minimal representation.
    // This sends back only specific fields (id, title, start_price) to the client,
    // avoiding sending unnecessary or sensitive data.
    const minimalItems = items.map(item => ({
      id: item._id, // MongoDB's default unique identifier for the document.
      title: item.title, // The title of the auction item.
      start_price: item.start_price // The starting price of the auction.
    }));

    // Send the array of minimal auction items as a JSON response with a 200 OK status.
    res.json(minimalItems);
  } catch (error) {
    // Log any errors that occur during the database operation or processing.
    console.error('Error fetching all auction items:', error);
    // Send a 500 Internal Server Error response to the client
    // indicating that something went wrong on the server side.
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Search API with validation middleware
// This handles GET /api/auctions/search requests
router.get('/search', validateSearchAuction, async (req, res) => {
  try {
    const { keyword, min_price, max_price } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (min_price !== undefined) {
      query.start_price = query.start_price || {};
      query.start_price.$gte = parseFloat(min_price);
    }
    if (max_price !== undefined) {
      query.start_price = query.start_price || {};
      query.start_price.$lte = parseFloat(max_price);
    }

    const items = await AuctionItem.find(query);

    const minimalItems = items.map(item => ({
      id: item._id,
      title: item.title,
      start_price: item.start_price,
    }));

    res.json(minimalItems);
  } catch (error) {
    console.error('Error fetching auction items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;