/**
 * Post Model
 * 
 * Defines the Post schema and model for MongoDB.
 * Represents blog posts or content entries created by users.
 */

import mongoose from "mongoose";

/**
 * Post Schema Definition
 * 
 * Defines the structure of post documents in the database:
 * - title: Title of the post (required)
 * - content: Main content/body of the post (required)
 * - user: Reference to the User who created the post (ObjectId reference)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    // Reference to User model - links post to its creator
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create and export the Post model based on the schema
export default mongoose.model("Post", postSchema);
