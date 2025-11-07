/**
 * Error Logger Middleware
 * 
 * Logs errors and stack traces to logs/error-<date>.log
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures the logs directory exists
 */
function ensureLogsDirectory() {
  const logsDir = path.join(__dirname, "../../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  return logsDir;
}

/**
 * Gets the log file path for today's error log
 */
function getErrorLogPath() {
  const logsDir = ensureLogsDirectory();
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(logsDir, `error-${date}.log`);
}

/**
 * Writes an error log entry to the error log file
 */
export function writeErrorLog(error, req = null) {
  const logPath = getErrorLogPath();
  const timestamp = new Date().toISOString();
  
  let logEntry = `[${timestamp}] ERROR\n`;
  
  if (req) {
    logEntry += `Method: ${req.method}\n`;
    logEntry += `Path: ${req.originalUrl || req.url}\n`;
    logEntry += `IP: ${req.ip || req.connection.remoteAddress}\n`;
  }
  
  logEntry += `Message: ${error.message || error}\n`;
  
  if (error.stack) {
    logEntry += `Stack Trace:\n${error.stack}\n`;
  }
  
  logEntry += `${"=".repeat(80)}\n\n`;
  
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write error log:", err);
    }
  });
  
  // Also log to console
  console.error(`[${timestamp}] ERROR:`, error.message || error);
  if (error.stack) {
    console.error(error.stack);
  }
}

/**
 * Error Handler Middleware
 * 
 * Catches errors and logs them to the error log file.
 * This middleware must have 4 parameters (err, req, res, next) for Express to recognize it as an error handler.
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  writeErrorLog(err, req);
  
  // Send error response
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  
  // In development, show detailed error messages
  // In production, show generic message for 500 errors, but specific messages for client errors (4xx)
  const errorMessage = process.env.NODE_ENV === "production" && statusCode === 500
    ? "Server error. Please try again later."
    : message;
  
  res.status(statusCode).json({
    message: errorMessage,
  });
};

