const request = require('supertest');
const app = require('../server'); // Import the Express app instance directly
const mongoose = require('mongoose');
const AuctionItem = require('../models/AuctionItem');

// No 'server' variable needed for Supertest when directly passing 'app'

beforeAll(async () => {
  // Connect to MongoDB (using a test database is best practice)
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/auction_test_db';
  await mongoose.connect(mongoUri); // Removed deprecated options from here too

  // No need to call app.listen() here when using request(app) for Supertest
});

beforeEach(async () => {
  // Clear the database and insert test data before each test
  await AuctionItem.deleteMany({});
  await AuctionItem.insertMany([
    { title: 'Vintage Painting', description: 'Oil on canvas', start_price: 150.00, end_date: new Date('2025-12-31') },
    { title: 'Antique Vase', description: 'Ming Dynasty', start_price: 500.00, end_date: new Date('2025-11-15') },
    { title: 'Modern Sculpture', description: 'Abstract art', start_price: 250.00, end_date: new Date('2025-10-01') },
    { title: 'Old Car', description: 'Model T', start_price: 1000.00, end_date: new Date('2025-09-01') },
  ]);
});

afterAll(async () => {
  // Close the database connection after all tests are done
  await mongoose.connection.close();
  // No server.close() needed here as we didn't call app.listen() in beforeAll
});

// --- Test Cases ---

describe('GET /api/auctions', () => {
  test('should return all auction items', async () => {
    // Use 'app' directly with supertest, no need for 'server' variable.
    const res = await request(app).get('/api/auctions');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(4); // Based on data inserted in beforeEach
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('start_price');
  });
});

describe('GET /api/auctions/search', () => {
  // Normal cases
  test('should return auction items matching keyword "painting"', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=painting');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual('Vintage Painting');
  });

  test('should return auction items within price range (min_price)', async () => {
    const res = await request(app).get('/api/auctions/search?min_price=200');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(3); // 250, 500, 1000 items
    expect(res.body.some(item => item.title === 'Vintage Painting')).toBeFalsy();
  });

  test('should return auction items within price range (max_price)', async () => {
    const res = await request(app).get('/api/auctions/search?max_price=300');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2); // 150, 250 items
    expect(res.body.some(item => item.title === 'Antique Vase')).toBeFalsy();
  });

  test('should return auction items matching keyword and price range', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=sculpture&min_price=200&max_price=300');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual('Modern Sculpture');
  });

  // Validation error tests
  test('should return 400 for keyword too short', async () => {
    const res = await request(app).get('/api/auctions/search?keyword=a');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/keyword.*length must be at least 2 characters long/);
  });

  test('should return 400 for keyword too long', async () => {
    const longKeyword = 'a'.repeat(101); // 101 'a' characters
    const res = await request(app).get(`/api/auctions/search?keyword=${longKeyword}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/keyword.*length must be less than or equal to 100 characters long/);
  });

  test('should return 400 for invalid min_price', async () => {
    const res = await request(app).get('/api/auctions/search?min_price=abc');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/min_price.*must be a number/);
  });

  test('should return 400 for invalid max_price', async () => {
    const res = await request(app).get('/api/auctions/search?max_price=xyz');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/max_price.*must be a number/);
  });
});

// Add tests for other API endpoints here if any