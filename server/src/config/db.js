/**
 * Database Configuration
 * 
 * This file handles the MongoDB database connection using Mongoose.
 * It connects to MongoDB using the connection string from environment variables.
 */

import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * 
 * Uses the MONGO_URI environment variable to connect to MongoDB.
 * Exits the process if connection fails to prevent the app from running without a database.
 * 
 * @async
 * @function connectDB
 * @throws {Error} If connection fails, logs error and exits process
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    // Log error and exit process if connection fails
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
