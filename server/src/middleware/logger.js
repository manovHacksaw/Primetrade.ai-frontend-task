/**
 * Request Logger Middleware
 * 
 * Logs HTTP requests with timestamp, method, path, status code, and response time.
 * Logs are written to logs/access-<date>.log
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
 * Gets the log file path for today's access log
 */
function getAccessLogPath() {
  const logsDir = ensureLogsDirectory();
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(logsDir, `access-${date}.log`);
}

/**
 * Writes a log entry to the access log file
 */
function writeAccessLog(logEntry) {
  const logPath = getAccessLogPath();
  const logLine = `${logEntry}\n`;
  
  fs.appendFile(logPath, logLine, (err) => {
    if (err) {
      console.error("Failed to write access log:", err);
    }
  });
}

/**
 * Request Logger Middleware
 * 
 * Logs:
 * - Timestamp
 * - HTTP Method
 * - Route Path
 * - Status Code
 * - Response Time (ms)
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const responseTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.originalUrl || req.url;
    const statusCode = res.statusCode;
    
    const logEntry = `[${timestamp}] ${method} ${path} ${statusCode} ${responseTime}ms`;
    
    // Write to access log file
    writeAccessLog(logEntry);
    
    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.log(logEntry);
    }
    
    // Call original end method
    originalEnd.apply(this, args);
  };
  
  next();
};

export default requestLogger;

