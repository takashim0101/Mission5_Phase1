// auction-api/routes/auctions.js
const express = require('express');
const router = express.Router();
const AuctionItem = require('../models/AuctionItem');
const { validateSearchAuction } = require('../validation/auctionValidation');

// Route to get all auction items
// This handles GET /api/auctions requests
router.get('/', async (req, res) => {
  try {
    const items = await AuctionItem.find({}); // Fetch all items
    const minimalItems = items.map(item => ({
      id: item._id,
      title: item.title,
      start_price: item.start_price
    }));
    res.json(minimalItems);
  } catch (error) {
    console.error('Error fetching all auction items:', error);
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