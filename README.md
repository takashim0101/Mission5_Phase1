# 📦 Mission 5: Trade Me Auction CLI & API Data Foundation

This repository contains the foundational code for a Trade Me-like auction system. It includes:

✅ A RESTful API for managing auction items  
✅ A Command-Line Interface (CLI) tool for database operations  

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Auction API](#auction-api)
  - [CLI Tool](#cli-tool)
- [Technologies Used](#technologies-used)

---

## 📌 Project Overview

This project provides a robust backend for an auction platform:

- **Auction API**: Handles core business logic for auction items (listing, searching, etc.)
- **CLI Tool**: Enables easy interaction with the database for tasks like seeding or clearing data.

---

## ✨ Features

### 🚀 Auction API
- RESTful Endpoints: Manage auction items via HTTP API
- Item Listing: Fetch all available auction items
- Search Functionality: Search by keyword, minimum price, or maximum price
- Input Validation: Ensures clean and safe data handling

### 💻 CLI Tool
- Data Seeding: Populate the database with sample auction items
- Data Clearing: Remove all auction items from the database

---

## 📋 Prerequisites

Make sure you have the following installed:

| Requirement | Version           |
|-------------|--------------------|
| Node.js     | v14+ (LTS)         |
| npm         | Bundled with Node |
| MongoDB     | Local/Cloud (e.g., MongoDB Atlas) |

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/takashim0101/Mission5_Phase1.git
cd Mission5_Phase1
Install API dependencies:

bash
Copy
Edit
cd auction-api
npm install
cd ..
Install CLI Tool dependencies:

bash
Copy
Edit
cd cli-tool
npm install
cd ..
🔧 Configuration
Both the API and CLI tool require environment variables.

🗂 API .env (in auction-api/)
env
Copy
Edit
PORT=3000
MONGO_URI=mongodb://localhost:27017/tradedb
PORT: Port for the API server (default: 3000)

MONGO_URI: MongoDB connection string

🗂 CLI Tool .env (in cli-tool/)
env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/tradedb
COLLECTION_NAME=auctions
COLLECTION_NAME: MongoDB collection name used by CLI (should match API)

🚀 Usage
📡 Auction API
Navigate to the API directory:

bash
Copy
Edit
cd auction-api
Start the API server:

bash
Copy
Edit
node index.js
API available at: http://localhost:3000

📖 API Endpoints
Method	Endpoint	Description
GET	/api/auctions	Retrieve all auction items
GET	/api/auctions/search	Search auction items

🔍 Search Parameters:
keyword (optional): Search by title or description

min_price (optional): Minimum price filter

max_price (optional): Maximum price filter

Example:

bash
Copy
Edit
http://localhost:3000/api/auctions/search?keyword=painting&min_price=100
🛠 CLI Tool
Navigate to project root:

bash
Copy
Edit
cd Mission5_Phase1
Seed the database with sample data:

bash
Copy
Edit
node cli-tool/index.js seed
Clear all auction data:

bash
Copy
Edit
node cli-tool/index.js clear
🛠 Technologies Used
Technology	Purpose
Node.js	JavaScript runtime
Express.js	Web framework for API
MongoDB	NoSQL database
Mongoose	MongoDB ODM
Commander.js	CLI tool framework
Dotenv	Environment variable management
Joi	Data validation
Supertest	API testing
