/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens from incoming requests.
 * Extracts user ID from token and attaches it to req.user for use in route handlers.
 */

import jwt from "jsonwebtoken";

/**
 * Authentication Middleware Function
 * 
 * Validates JWT token from Authorization header and extracts user ID.
 * 
 * Expected header format: "Authorization: Bearer <token>"
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * On success:
 *   - Sets req.user to the user ID from the token
 *   - Calls next() to continue to the next middleware/route handler
 * 
 * On failure:
 *   - Returns 401 status with error message
 */
const auth = (req, res, next) => {
  // Extract token from Authorization header
  // Format: "Bearer <token>" - split by space and take the second part
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Verify token signature and decode payload
    // JWT_SECRET must match the secret used when creating the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request object for use in route handlers
    req.user = decoded.id;
    
    // Continue to next middleware/route handler
    next();
  } catch (err) {
    // Token is invalid, expired, or malformed
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
