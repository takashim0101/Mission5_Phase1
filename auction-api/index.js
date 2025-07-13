// auction-api/index.js

// Import the Express application instance from 'server.js'.
// This 'app' object is the core of your Express application, configured with middleware and routes.
const app = require('./server');

// Import the dotenv library.
// Dotenv loads environment variables from a .env file into process.env.
const dotenv = require('dotenv');

// Load environment variables from the .env file.
// This should be called as early as possible in your application's lifecycle
// to ensure that environment variables are available throughout the app.
dotenv.config();

// Define the port on which the server will listen.
// It first tries to get the port from the environment variables (e.g., for deployment platforms),
// and if not found, it defaults to port 3000 for local development.
const PORT = process.env.PORT || 3000;

// Start the Express server.
// The app.listen() method binds the application to a specific network port.
app.listen(PORT, () => {
  // Log a message to the console indicating that the server has started successfully
  // and on which port it is listening.
  console.log(`Server running on port ${PORT}`);
  // Provide helpful URLs for accessing the API endpoints in the console.
  console.log(`Access API at http://localhost:${PORT}/api/auctions`);
  console.log(`Access search API at http://localhost:${PORT}/api/auctions/search?keyword=your_keyword`);
});