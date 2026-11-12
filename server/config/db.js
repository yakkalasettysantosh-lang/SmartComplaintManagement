const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_system';
  
  try {
    // Attempt standard connection
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`! Standard MongoDB connection to ${uri} failed: ${err.message}`);
    console.log(' Attempting fallback to in-memory MongoDB instance for seamless testing...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(` In-Memory MongoDB Started & Connected: ${memUri}`);
      
      // Seed automatically if in-memory
      const { seedInitialData } = require('../utils/seedData');
      await seedInitialData();
      return conn;
    } catch (memErr) {
      console.error(' Failed to initialize in-memory MongoDB fallback:', memErr.message);
      console.error(' Please ensure MongoDB is running or configure MONGODB_URI in .env');
      throw err;
    }
  }
};

module.exports = connectDB;
