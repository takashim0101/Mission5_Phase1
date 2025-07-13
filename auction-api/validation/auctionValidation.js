// auction-api/validation/auctionValidation.js

// Import the Joi library for schema validation.
// Joi is a powerful schema description language and data validator for JavaScript.
const Joi = require('joi');

// Define a Joi schema for validating auction search parameters.
// This schema specifies the expected data types, formats, and constraints for the query parameters.
const searchAuctionSchema = Joi.object({
  // 'keyword' field:
  // - Joi.string(): Ensures the value is a string.
  // - .trim(): Removes leading and trailing whitespace.
  // - .min(2): Requires the string to have a minimum length of 2 characters.
  // - .max(100): Requires the string to have a maximum length of 100 characters. (Confirmed: max(100) is here)
  // - .optional(): Makes this field optional; it doesn't have to be present in the request.
  keyword: Joi.string().trim().min(2).max(100).optional(),
  // 'min_price' field:
  // - Joi.number(): Ensures the value is a number.
  // - .min(0): Requires the number to be greater than or equal to 0.
  // - .optional(): Makes this field optional.
  min_price: Joi.number().min(0).optional(),
  // 'max_price' field:
  // - Joi.number(): Ensures the value is a number.
  // - .min(0): Requires the number to be greater than or equal to 0.
  // - .optional(): Makes this field optional.
  max_price: Joi.number().min(0).optional(),
});

// Middleware function to validate auction search requests.
// This function will be used in Express routes to validate incoming query parameters.
const validateSearchAuction = (req, res, next) => {
  // Validate the 'req.query' object against the 'searchAuctionSchema'.
  // 'req.query' contains the query parameters from the URL (e.g., ?keyword=test&min_price=100).
  const { error } = searchAuctionSchema.validate(req.query); // Confirmed: req.query is being validated.

  // If validation fails (i.e., 'error' object is present).
  if (error) {
    // Return a 400 Bad Request status with a JSON object containing the validation error message.
    // 'error.details[0].message' provides a user-friendly error message from Joi.
    return res.status(400).json({ message: error.details[0].message }); // Confirmed: 400 error is returned.
  }
  // If validation passes, call 'next()' to pass control to the next middleware function
  // or the route handler.
  next();
};

// Export the validation middleware function so it can be used in other files (e.g., in auction routes).
module.exports = {
  validateSearchAuction,
};