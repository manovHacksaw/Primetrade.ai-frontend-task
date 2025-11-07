/**
 * Server Entry Point
 * 
 * This file starts the Express server and listens for incoming requests.
 * It imports the configured Express app and starts the HTTP server.
 */

import app from "./app.js";
import { writeErrorLog } from "./middleware/errorLogger.js";

// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  writeErrorLog(error);
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  writeErrorLog(new Error(`Unhandled Rejection: ${reason}`));
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
}).on("error", (error) => {
  writeErrorLog(error);
  console.error("Server error:", error);
  process.exit(1);
});
