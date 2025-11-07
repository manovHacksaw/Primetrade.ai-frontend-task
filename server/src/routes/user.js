/**
 * User Routes
 * 
 * Handles user account update operations.
 * All routes require authentication via the auth middleware.
 */

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * PATCH /user/username
 * 
 * Updates the username for the authenticated user.
 * Requires password confirmation for security.
 * 
 * Requires: Authentication token in Authorization header
 * Request body:
 *   - newUsername: New username to set
 *   - password: Current password for verification
 * 
 * Response:
 *   - 200: Username updated successfully
 *   - 400: Username already exists, empty, or invalid password
 *   - 401: Not authenticated
 *   - 500: Server error
 */
router.patch("/username", auth, async (req, res) => {
  try {
    const { newUsername, password } = req.body;

    // Validate inputs
    if (!newUsername || newUsername.trim() === "") {
      return res.status(400).json({ message: "Username cannot be empty" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find user and include password field for verification
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: newUsername.trim() });
    if (existingUser && existingUser._id.toString() !== req.user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Update username
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username: newUsername.trim() },
      { new: true }
    ).select("-password");

    return res.json({ message: "Username updated successfully", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /user/password
 * 
 * Updates the password for the authenticated user.
 * Requires verification of current password before allowing change.
 * 
 * Requires: Authentication token in Authorization header
 * Request body:
 *   - currentPassword: Current password for verification
 *   - newPassword: New password to set
 * 
 * Response:
 *   - 200: Password updated successfully
 *   - 400: Invalid current password or weak new password
 *   - 401: Not authenticated
 *   - 500: Server error
 */
router.patch("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.trim() === "" || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Find user and include password field
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(req.user, { password: hashedPassword });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

