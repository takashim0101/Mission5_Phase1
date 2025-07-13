// auction-api/models/AuctionItem.js

// Import the Mongoose library, which provides an ODM (Object Data Modeling)
// for MongoDB and Node.js, making it easier to interact with the database.
const mongoose = require('mongoose');

// Define the schema for an Auction Item.
// A schema defines the structure of the documents that will be stored in a MongoDB collection,
// including field names, their data types, validation rules, and default values.
const AuctionItemSchema = new mongoose.Schema({
  // Title of the auction item.
  title: {
    type: String, // Data type is String.
    required: true // This field is mandatory.
  },
  // Description of the auction item.
  description: {
    type: String, // Data type is String.
    required: true // This field is mandatory.
  },
  // The starting price for the auction.
  start_price: {
    type: Number, // Data type is Number.
    required: true // This field is mandatory.
  },
  // The reserve price for the auction. If the highest bid does not meet
  // or exceed this price, the item may not be sold.
  reserve_price: {
    type: Number, // Data type is Number.
    default: null // Default value is null, considering cases where there is no reserve price set.
  },
  // Additional fields can be added here as needed for the auction item,
  // such as images, categories, seller information, etc.

  // Timestamp for when the auction item was created.
  created_at: {
    type: Date, // Data type is Date.
    default: Date.now // Default value is the current date and time when the document is created.
  }
});

// Export the Mongoose model based on the schema.
// 'AuctionItem' is the name of the model. Mongoose will automatically pluralize this
// to find the collection name (e.g., 'auctionitems').
// However, by explicitly providing 'auctions' as the third argument, we specify
// the exact MongoDB collection name to use. This should match the collection
// name used by your CLI tool or any other part of your application interacting
// with this data.
module.exports = mongoose.model('AuctionItem', AuctionItemSchema, 'auctions');
