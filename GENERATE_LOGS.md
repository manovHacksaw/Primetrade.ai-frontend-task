# Log Generation Instructions

This document explains how to generate logs for the final submission.

## Prerequisites

1. MongoDB must be running
2. Backend server must be running
3. Frontend server must be running

## Step 1: Start the Backend Server with Logging

```bash
cd server
npm run dev
```

Or to capture all output to a log file:

```bash
cd server
npm run log
```

## Step 2: Generate Access Logs

The access logs are automatically generated when you make API requests. To generate meaningful logs, perform the following actions:

### Authentication Logs
1. **Login Success**: Login with valid credentials
2. **Login Failure**: Attempt login with invalid credentials
3. **Signup New User**: Register a new user account
4. **Signup Existing Email**: Attempt to register with an email that already exists

### Post CRUD Logs
1. **Create Post**: Create a new post
2. **View Dashboard**: Access the dashboard (fetches posts)
3. **View Posts List**: Navigate to posts page
4. **View Single Post**: Click on a post to view details
5. **Update Post**: Edit an existing post
6. **Delete Post**: Delete a post

### User Profile Logs
1. **View Settings**: Navigate to settings page (fetches user profile)
2. **Update Username**: Change username in settings
3. **Update Password**: Change password in settings

## Step 3: Check Generated Logs

After performing the above actions, check the `server/logs/` directory:

- `access-YYYY-MM-DD.log` - Contains all HTTP request logs
- `error-YYYY-MM-DD.log` - Contains error logs (if any errors occurred)
- `server-YYYY-MM-DD.log` - Contains server console output (if using `npm run log`)

## Log Format

### Access Log Format
```
[2024-01-15T10:30:45.123Z] POST /auth/login 200 45ms
[2024-01-15T10:30:50.456Z] GET /posts 200 23ms
```

### Error Log Format
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

## Step 4: Postman Collection Runner

1. Open Postman
2. Import `Postman_Collection.json`
3. Go to Collections → Primetrade.ai API Collection → Run
4. Run all requests
5. Export the run results:
   - Click "Export Results"
   - Save as `postman/run-report-YYYY-MM-DD.json`

## Step 5: Screenshots

Take screenshots of the following pages:

1. `screenshots/login.png` - Login page
2. `screenshots/signup.png` - Signup page
3. `screenshots/dashboard.png` - Dashboard page
4. `screenshots/posts-list.png` - Posts list page
5. `screenshots/post-view.png` - Single post view page
6. `screenshots/post-create.png` - Create post page
7. `screenshots/post-edit.png` - Edit post page
8. `screenshots/settings.png` - Settings page

## Notes

- Logs are automatically created with today's date
- Access logs are appended to the file, so you can run multiple test sessions
- Error logs only contain entries when errors occur
- Make sure to test both success and failure scenarios for comprehensive logs

