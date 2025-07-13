// Import necessary testing libraries and modules
const request = require('supertest'); // Supertest is used for testing HTTP requests, making assertions about responses.
const app = require('../server'); // Import the Express application instance directly for testing.
const mongoose = require('mongoose'); // Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
const AuctionItem = require('../models/AuctionItem'); // Import the Mongoose model for AuctionItem.

// The 'server' variable is not needed for Supertest when directly passing the 'app' instance,
// as Supertest can automatically bind to the Express app.

// beforeAll hook: Runs once before all tests in this file.
beforeAll(async () => {
  // Connect to MongoDB. It's best practice to use a separate test database
  // to avoid interfering with your development or production data.
  // The connection URI is taken from environment variables or defaults to a local test database.
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/auction_test_db';
  await mongoose.connect(mongoUri); // Establish the connection to the MongoDB test database.

  // No need to call app.listen() here when using request(app) for Supertest.
  // Supertest handles the server lifecycle internally for testing purposes.
});

// beforeEach hook: Runs before each individual test case.
beforeEach(async () => {
  // Clear the database before each test to ensure a clean state.
  // This prevents tests from affecting each other due to leftover data.
  await AuctionItem.deleteMany({});
  // Insert fresh test data into the database for each test.
  await AuctionItem.insertMany([
    { title: 'Vintage Painting', description: 'Oil on canvas', start_price: 150.00, end_date: new Date('2025-12-31') },
    { title: 'Antique Vase', description: 'Ming Dynasty', start_price: 500.00, end_date: new Date('2025-11-15') },
    { title: 'Modern Sculpture', description: 'Abstract art', start_price: 250.00, end_date: new Date('2025-10-01') },
    { title: 'Old Car', description: 'Model T', start_price: 1000.00, end_date: new Date('2025-09-01') },
  ]);
});

// afterAll hook: Runs once after all tests in this file have completed.
afterAll(async () => {
  // Close the database connection to free up resources.
  await mongoose.connection.close();
  // No server.close() is needed here because app.listen() was not called in beforeAll.
  // Supertest manages the server lifecycle for the duration of the tests.
});

// --- Test Cases ---

// Describe block for testing the GET /api/auctions endpoint
describe('GET /api/auctions', () => {
  // Test case: Should return all auction items
  test('should return all auction items', async () => {
    // Make an HTTP GET request to the /api/auctions endpoint using Supertest.
    // 'app' is passed directly to 'request' for testing the Express application.
    const res = await request(app).get('/api/auctions');
    // Assert that the HTTP status code is 200 (OK).
    expect(res.statusCode).toEqual(200);
    // Assert that the response body is an array.
    expect(res.body).toBeInstanceOf(Array);
    // Assert that the array contains 4 items, matching the data inserted in beforeEach.
    expect(res.body.length).toEqual(4);
    // Assert that the first item in the array has a 'title' property.
    expect(res.body[0]).toHaveProperty('title');
    // Assert that the first item in the array has a 'start_price' property.
    expect(res.body[0]).toHaveProperty('start_price');
  });
});

// Describe block for testing the GET /api/auctions/search endpoint
describe('GET /api/auctions/search', () => {
  // --- Normal cases (successful searches) ---

  // Test case: Should return auction items matching a specific keyword.
  test('should return auction items matching keyword "painting"', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=painting');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual('Vintage Painting');
  });

  // Test case: Should return auction items within a specified minimum price range.
  test('should return auction items within price range (min_price)', async () => {
    const res = await request(app).get('/api/auctions/search?min_price=200');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(3); // Expecting items with prices 250, 500, 1000.
    // Assert that the 'Vintage Painting' (price 150) is NOT included.
    expect(res.body.some(item => item.title === 'Vintage Painting')).toBeFalsy();
  });

  // Test case: Should return auction items within a specified maximum price range.
  test('should return auction items within price range (max_price)', async () => {
    const res = await request(app).get('/api/auctions/search?max_price=300');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2); // Expecting items with prices 150, 250.
    // Assert that the 'Antique Vase' (price 500) is NOT included.
    expect(res.body.some(item => item.title === 'Antique Vase')).toBeFalsy();
  });

  // Test case: Should return auction items matching both keyword and price range.
  test('should return auction items matching keyword and price range', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=sculpture&min_price=200&max_price=300');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual('Modern Sculpture');
  });

  // --- Validation error tests (unsuccessful requests due to invalid input) ---

  // Test case: Should return 400 status code for a keyword that is too short.
  test('should return 400 for keyword too short', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=a');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    // Assert that the error message contains specific text related to keyword length.
    expect(res.body.message).toMatch(/keyword.*length must be at least 2 characters long/);
  });

  // Test case: Should return 400 status code for a keyword that is too long.
  test('should return 400 for keyword too long', async () => {
    const longKeyword = 'a'.repeat(101); // Create a string with 101 'a' characters.
    const res = await request(app).get(`/api/auctions/search?keyword=${longKeyword}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    // Assert that the error message contains specific text related to keyword length.
    expect(res.body.message).toMatch(/keyword.*length must be less than or equal to 100 characters long/);
  });

  // Test case: Should return 400 status code for an invalid min_price (non-numeric).
  test('should return 400 for invalid min_price', async () => {
    const res = await request(app).get('/api/auctions/search?min_price=abc');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    // Assert that the error message indicates that min_price must be a number.
    expect(res.body.message).toMatch(/min_price.*must be a number/);
  });

  // Test case: Should return 400 status code for an invalid max_price (non-numeric).
  test('should return 400 for invalid max_price', async () => {
    const res = await request(app).get('/api/auctions/search?max_price=xyz');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    // Assert that the error message indicates that max_price must be a number.
    expect(res.body.message).toMatch(/max_price.*must be a number/);
  });
});

// Placeholder for additional test cases for other API endpoints if they exist.
// Add tests for other API endpoints here if any
