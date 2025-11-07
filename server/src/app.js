/**
 * Express Application Setup
 * 
 * This file configures the main Express application with middleware,
 * database connection, and route handlers.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";
import requestLogger from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorLogger.js";

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
// Try loading from server directory, then fallback to default
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config(); // Also try default location

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is not set!");
  console.error("Please create a .env file in the server directory with:");
  console.error("MONGO_URI=mongodb://localhost:27017/primetrade");
  console.error("Or set it as an environment variable.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET environment variable is not set!");
  console.error("Please create a .env file in the server directory with:");
  console.error("JWT_SECRET=your-secret-key-here");
  console.error("Or set it as an environment variable.");
  process.exit(1);
}

// Establish MongoDB connection
connectDB();

// Initialize Express application
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from different origins
app.use(cors());

// Parse incoming JSON requests and make data available in req.body
app.use(express.json());

// Request logging middleware (must be after other middleware but before routes)
app.use(requestLogger);

// Mount route handlers
// All routes starting with /auth will be handled by authRoutes
app.use("/auth", authRoutes);
// All routes starting with /posts will be handled by postRoutes
app.use("/posts", postRoutes);
// All routes starting with /user will be handled by userRoutes
app.use("/user", userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
