# Logging Setup Summary

## ✅ Completed Setup

### 1. Logging Infrastructure
- ✅ Created `server/logs/` directory
- ✅ Created request logger middleware (`server/src/middleware/logger.js`)
- ✅ Created error logger middleware (`server/src/middleware/errorLogger.js`)
- ✅ Integrated logging middleware into Express app
- ✅ Added error handling for uncaught exceptions and unhandled rejections

### 2. Log Files Generated
Logs are automatically created in `server/logs/`:

- **`access-YYYY-MM-DD.log`**: HTTP request logs with:
  - Timestamp (ISO format)
  - HTTP method
  - Route path
  - Status code
  - Response time in milliseconds

- **`error-YYYY-MM-DD.log`**: Error logs with:
  - Timestamp
  - Request details (method, path, IP)
  - Error message
  - Stack trace

- **`server-YYYY-MM-DD.log`**: Server console output (when using `npm run log`)

### 3. Package.json Scripts
Added logging script:
```json
"log": "node src/server.js 2>&1 | tee -a logs/server-$(date +%F).log"
```

### 4. Directory Structure
Created required directories:
- `server/logs/` - For log files
- `postman/` - For Postman collection and test results
- `screenshots/` - For application screenshots

## 📝 How Logging Works

### Request Logging
Every HTTP request is automatically logged when:
1. Request comes in
2. Response is sent
3. Response time is calculated
4. Log entry is written to `access-YYYY-MM-DD.log`

### Error Logging
Errors are logged when:
1. An error occurs in a route handler
2. An uncaught exception occurs
3. An unhandled promise rejection occurs
4. Server startup fails

## 🚀 Usage

### Normal Development
```bash
cd server
npm run dev
```
Logs are written automatically to `logs/access-YYYY-MM-DD.log`

### With Server Log Capture
```bash
cd server
npm run log
```
Both server output and logs are captured to `logs/server-YYYY-MM-DD.log`

## 📋 Next Steps for Submission

1. **Generate Logs**: Start the server and perform actions (see GENERATE_LOGS.md)
2. **Run Postman**: Import collection and run tests, export results
3. **Take Screenshots**: Capture all required pages
4. **Verify**: Check that all log files contain meaningful entries

## 🔍 Log File Examples

### Access Log Entry
```
[2024-01-15T10:30:45.123Z] POST /auth/login 200 45ms
[2024-01-15T10:30:50.456Z] GET /posts 200 23ms
[2024-01-15T10:31:00.789Z] POST /auth/login 400 12ms
```

### Error Log Entry
```
[2024-01-15T10:30:45.123Z] ERROR
Method: POST
Path: /auth/login
IP: ::1
Message: Invalid credentials
Stack Trace:
Error: Invalid credentials
    at ...
================================================================================
```

## ⚙️ Configuration

Logging is configured automatically:
- Logs directory is created if it doesn't exist
- Log files are named with current date
- Logs are appended (not overwritten)
- Console output is also shown in development mode

## 📝 Notes

- Log files are gitignored (see `server/.gitignore`)
- Log directory structure is preserved with `.gitkeep` files
- Logs don't affect API behavior or performance
- All logging is non-blocking (async file writes)

