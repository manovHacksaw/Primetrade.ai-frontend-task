/**
 * Server Entry Point
 * 
 * This file starts the Express server and listens for incoming requests.
 * It imports the configured Express app and starts the HTTP server.
 */

import app from "./app.js";

// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
