/**
 * Express Application Setup
 * 
 * This file configures the main Express application with middleware,
 * database connection, and route handlers.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";
import requestLogger from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorLogger.js";

// Load environment variables from .env file
dotenv.config();

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
