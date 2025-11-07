/**
 * Authentication Routes
 * 
 * Handles user registration and login endpoints.
 * Provides JWT-based authentication for the application.
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /auth/register
 * 
 * Registers a new user account.
 * 
 * Request body:
 *   - username: Unique username
 *   - email: Unique email address
 *   - password: Plain text password (will be hashed)
 * 
 * Response:
 *   - 200: User successfully registered
 *   - 400: Email already in use
 *   - 500: Server error
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with this email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    // Hash password with bcrypt (10 rounds for salt)
    // Never store plain text passwords in the database
    const hashed = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const user = await User.create({ username, email, password: hashed });
    return res.json({ message: "User registered", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /auth/login
 * 
 * Authenticates a user and returns a JWT token.
 * 
 * Request body:
 *   - email: User's email address
 *   - password: Plain text password
 * 
 * Response:
 *   - 200: Login successful, returns JWT token
 *   - 400: Invalid credentials (email or password incorrect)
 *   - 500: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare provided password with hashed password in database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token with user ID as payload
    // Token expires based on JWT_SECRET configuration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /auth/me
 * 
 * Returns the current authenticated user's information.
 * 
 * Requires: Authentication token in Authorization header
 * 
 * Response:
 *   - 200: User information (email, username)
 *   - 401: No token or invalid token
 */
router.get("/me", auth, async (req, res) => {
  try {
    // req.user is set by auth middleware and contains the user ID
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
