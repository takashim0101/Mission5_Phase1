# 🛠 CLI Tool for Auction Data Management

This command-line interface (CLI) tool manages auction item data within a MongoDB database.  
It provides functionalities to:  

- 🌱 Seed sample data from `sample-data.json`
- 🧹 Clear existing data from the configured collection

---

## 📖 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Seed Command](#seed-command)
  - [Clear Command](#clear-command)

---

## ✨ Features

- **Seed Data**: Populate the MongoDB auction collection with sample data from `sample-data.json`.
- **Clear Data**: Remove all documents from the MongoDB auction collection.

---

## 📋 Prerequisites

Before using this CLI tool, ensure you have the following installed:

- [Node.js](https://nodejs.org) (LTS version recommended)
- npm (Node Package Manager, included with Node.js)
- MongoDB instance running (e.g., local MongoDB server or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## ⚙️ Installation

Navigate to the `cli-tool` directory within your project:

```bash
cd Mission-5-Trade-Me-Auction-CLI-API-Data-Foundation/cli-tool
Install the necessary Node.js dependencies:

bash
Copy
Edit
npm install
🔧 Configuration
This tool uses environment variables for database connection.
Create a .env file in the cli-tool directory with the following content:

env
Copy
Edit
# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/tradedb

# Name of the MongoDB collection for auction items
COLLECTION_NAME=auctions
MONGO_URI: Set this to your MongoDB connection string. Example uses a local MongoDB instance with a database named tradedb.

COLLECTION_NAME: Set this to the name of your MongoDB collection where auction items are stored (default is auctions).

🚀 Usage
You can run the commands from within the cli-tool directory or from the project root by specifying the path to index.js.

🌱 Seed Command
To insert sample auction data into your MongoDB collection:

bash
Copy
Edit
node index.js seed
Or from the project root:

bash
Copy
Edit
node cli-tool/index.js seed
This command will:

Connect to the MongoDB database

Clear any existing data in the configured collection

Read data from sample-data.json

Insert the sample data into the collection

Close the database connection

🧹 Clear Command
To remove all data from your MongoDB auction collection:

bash
Copy
Edit
node index.js clear
Or from the project root:

bash
Copy
Edit
node cli-tool/index.js clear
This command will:

Connect to the MongoDB database

Delete all documents from the configured collection

Close the database connection
