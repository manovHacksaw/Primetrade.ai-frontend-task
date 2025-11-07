/**
 * Post Routes
 * 
 * Handles CRUD operations for posts.
 * All routes require authentication via the auth middleware.
 */

import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /posts
 * 
 * Creates a new post for the authenticated user.
 * 
 * Requires: Authentication token in Authorization header
 * Request body:
 *   - title: Post title
 *   - content: Post content
 * 
 * Response: Created post object
 */
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  // req.user is set by auth middleware and contains the user ID
  const post = await Post.create({ title, content, user: req.user });
  return res.json(post);
});

/**
 * GET /posts
 * 
 * Retrieves all posts belonging to the authenticated user.
 * Posts are sorted by creation date (newest first).
 * 
 * Requires: Authentication token in Authorization header
 * 
 * Response: Array of user's posts
 */
router.get("/", auth, async (req, res) => {
  // Find all posts for the authenticated user, sorted by newest first
  const posts = await Post.find({ user: req.user }).sort({ createdAt: -1 });
  return res.json(posts);
});

/**
 * GET /posts/:id
 * 
 * Retrieves a single post by ID.
 * Only allows viewing posts that belong to the authenticated user.
 * 
 * Requires: Authentication token in Authorization header
 * URL params:
 *   - id: Post ID to retrieve
 * 
 * Response: Post object
 */
router.get("/:id", auth, async (req, res) => {
  try {
    // Find post that belongs to authenticated user
    const post = await Post.findOne({ _id: req.params.id, user: req.user });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /posts/:id
 * 
 * Updates an existing post.
 * Only allows updating posts that belong to the authenticated user.
 * 
 * Requires: Authentication token in Authorization header
 * URL params:
 *   - id: Post ID to update
 * Request body:
 *   - title: Updated post title (optional)
 *   - content: Updated post content (optional)
 * 
 * Response: Updated post object
 */
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  // Only update if post belongs to authenticated user
  // { new: true } returns the updated document instead of the original
  const updated = await Post.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { title, content },
    { new: true }
  );
  return res.json(updated);
});

/**
 * DELETE /posts/:id
 * 
 * Deletes a post.
 * Only allows deleting posts that belong to the authenticated user.
 * 
 * Requires: Authentication token in Authorization header
 * URL params:
 *   - id: Post ID to delete
 * 
 * Response: Success message
 */
router.delete("/:id", auth, async (req, res) => {
  // Only delete if post belongs to authenticated user
  await Post.findOneAndDelete({ _id: req.params.id, user: req.user });
  return res.json({ message: "Deleted" });
});

export default router;
