// cli-tool/index.js
require('dotenv').config(); // .envファイルを読み込む
const { MongoClient } = require('mongodb');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGO_URI; // .envからURIを取得
const dbName = new URL(uri).pathname.substring(1); // URIからデータベース名を取得
const collectionName = process.env.COLLECTION_NAME || 'auctions'; // コレクション名

const client = new MongoClient(uri);
const program = new Command();

program
  .version('1.0.0')
  .description('CLI tool for managing auction data in MongoDB');

// Seed コマンド
program
  .command('seed')
  .description('Seeds sample auction data into MongoDB')
  .action(async () => {
    console.log('Connecting to MongoDB...');
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // 既存データを削除 (オプションだが、繰り返しのシードに便利)
      console.log(`Clearing existing data from '${collectionName}' collection...`);
      await collection.deleteMany({});
      console.log('Existing data cleared.');

      // サンプルデータを読み込む
      const dataPath = path.resolve(__dirname, 'sample-data.json');
      const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      console.log(`Inserting ${sampleData.length} documents into '${collectionName}' collection...`);
      await collection.insertMany(sampleData);
      console.log('Data seeding completed successfully!');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  });

// Clear コマンド (データを全削除する機能)
program
  .command('clear')
  .description('Clears all data from the auction collection in MongoDB')
  .action(async () => {
    console.log('Connecting to MongoDB...');
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      console.log(`Clearing all data from '${collectionName}' collection...`);
      await collection.deleteMany({});
      console.log('All data cleared successfully!');
    } catch (error) {
      console.error('Error during clearing data:', error);
    } finally {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  });

program.parse(process.argv);