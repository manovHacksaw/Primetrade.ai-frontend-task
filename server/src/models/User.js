/**
 * User Model
 * 
 * Defines the User schema and model for MongoDB.
 * Stores user authentication information including username, email, and hashed password.
 */

import mongoose from "mongoose";

/**
 * User Schema Definition
 * 
 * Defines the structure of user documents in the database:
 * - username: Unique username for the user
 * - email: Unique email address for authentication
 * - password: Hashed password (should never store plain text passwords)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create and export the User model based on the schema
export default mongoose.model("User", userSchema);
