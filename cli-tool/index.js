// cli-tool/index.js

// Load environment variables from the .env file.
// This ensures that variables like MONGO_URI and COLLECTION_NAME are available.
require('dotenv').config();
// Import MongoClient from the mongodb package to connect to a MongoDB database.
const { MongoClient } = require('mongodb');
// Import Command from the commander package to build command-line interfaces.
const { Command } = require('commander');
// Import the built-in Node.js 'fs' module for file system operations (e.g., reading files).
const fs = require('fs');
// Import the built-in Node.js 'path' module for working with file and directory paths.
const path = require('path');

// Retrieve the MongoDB connection URI from environment variables.
const uri = process.env.MONGO_URI;
// Extract the database name from the MongoDB URI.
// new URL(uri).pathname gives '/tradedb', so .substring(1) removes the leading '/'.
const dbName = new URL(uri).pathname.substring(1);
// Retrieve the MongoDB collection name from environment variables, defaulting to 'auctions'.
const collectionName = process.env.COLLECTION_NAME || 'auctions';

// Create a new MongoClient instance with the connection URI.
const client = new MongoClient(uri);
// Create a new Commander program instance.
const program = new Command();

// Configure the CLI program's version and description.
program
  .version('1.0.0') // Set the version of the CLI tool.
  .description('CLI tool for managing auction data in MongoDB'); // Provide a description for the tool.

// Define the 'seed' command.
// This command is used to insert sample auction data into the MongoDB collection.
program
  .command('seed') // Define the command name.
  .description('Seeds sample auction data into MongoDB') // Provide a description for the command.
  .action(async () => { // Define the action to be performed when the 'seed' command is executed.
    console.log('Connecting to MongoDB...');
    try {
      // Establish a connection to the MongoDB server.
      await client.connect();
      // Get a reference to the specific database.
      const db = client.db(dbName);
      // Get a reference to the specific collection within the database.
      const collection = db.collection(collectionName);

      // Optional: Clear existing data from the collection.
      // This is useful for repeatable seeding, ensuring that data is fresh each time.
      console.log(`Clearing existing data from '${collectionName}' collection...`);
      await collection.deleteMany({}); // Delete all documents in the collection.
      console.log('Existing data cleared.');

      // Read sample data from a JSON file.
      // path.resolve(__dirname, 'sample-data.json') constructs the absolute path to the file.
      const dataPath = path.resolve(__dirname, 'sample-data.json');
      // fs.readFileSync reads the file synchronously, and JSON.parse parses its content.
      const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // Insert the sample data into the collection.
      console.log(`Inserting ${sampleData.length} documents into '${collectionName}' collection...`);
      await collection.insertMany(sampleData); // Insert multiple documents.
      console.log('Data seeding completed successfully!');
    } catch (error) {
      // Catch and log any errors that occur during the seeding process.
      console.error('Error during seeding:', error);
    } finally {
      // Ensure the MongoDB connection is closed regardless of success or failure.
      await client.close();
      console.log('MongoDB connection closed.');
    }
  });

// Define the 'clear' command.
// This command is used to remove all data from the auction collection.
program
  .command('clear') // Define the command name.
  .description('Clears all data from the auction collection in MongoDB') // Provide a description for the command.
  .action(async () => { // Define the action to be performed when the 'clear' command is executed.
    console.log('Connecting to MongoDB...');
    try {
      // Establish a connection to the MongoDB server.
      await client.connect();
      // Get a reference to the specific database.
      const db = client.db(dbName);
      // Get a reference to the specific collection within the database.
      const collection = db.collection(collectionName);

      // Clear all data from the collection.
      console.log(`Clearing all data from '${collectionName}' collection...`);
      await collection.deleteMany({}); // Delete all documents in the collection.
      console.log('All data cleared successfully!');
    } catch (error) {
      // Catch and log any errors that occur during the clearing process.
      console.error('Error during clearing data:', error);
    } finally {
      // Ensure the MongoDB connection is closed regardless of success or failure.
      await client.close();
      console.log('MongoDB connection closed.');
    }
  });

// Parse the command-line arguments.
// This line must be called after defining all commands and options.
program.parse(process.argv);
