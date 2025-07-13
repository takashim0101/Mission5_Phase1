// auction-api/models/AuctionItem.js
const mongoose = require('mongoose');

const AuctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start_price: {
    type: Number,
    required: true
  },
  reserve_price: {
    type: Number,
    default: null //Consider the case where there is no reserve price
  },
  // Add other fields as needed
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuctionItem', AuctionItemSchema, 'auctions');
// 'auctions' is the MongoDB collection name, match the name you used in the CLI tool.