# Submission Checklist

This checklist ensures all required deliverables are included for the final submission.

## ✅ Required Files

### 1. Code Repository
- [x] Frontend code (Next.js)
- [x] Backend code (Node.js/Express)
- [x] All dependencies properly configured
- [x] README.md with setup instructions

### 2. Documentation
- [x] `README.md` - Project overview and setup instructions
- [x] `API_DOCUMENTATION.md` - Complete API documentation
- [x] `SCALING_NOTES.md` - Production scaling strategies
- [x] `GENERATE_LOGS.md` - Instructions for generating logs

### 3. Postman Collection
- [x] `Postman_Collection.json` - API collection for testing
- [ ] `postman/run-report-YYYY-MM-DD.json` - Postman Runner results (to be generated)

### 4. Log Files
- [ ] `server/logs/access-YYYY-MM-DD.log` - Access logs (to be generated)
- [ ] `server/logs/error-YYYY-MM-DD.log` - Error logs (if errors occurred)
- [ ] `server/logs/server-YYYY-MM-DD.log` - Server logs (optional, if using `npm run log`)

### 5. Screenshots
- [ ] `screenshots/login.png` - Login page
- [ ] `screenshots/signup.png` - Signup page
- [ ] `screenshots/dashboard.png` - Dashboard page
- [ ] `screenshots/posts-list.png` - Posts list page
- [ ] `screenshots/post-view.png` - Single post view
- [ ] `screenshots/post-create.png` - Create post page
- [ ] `screenshots/post-edit.png` - Edit post page
- [ ] `screenshots/settings.png` - Settings page

## 📝 Steps to Complete Submission

### Step 1: Generate Logs
1. Start MongoDB
2. Start backend server: `cd server && npm run dev`
3. Start frontend server: `cd client && npm run dev`
4. Perform the following actions:
   - Login (success + failure)
   - Signup (new user + existing email)
   - Create post
   - View dashboard
   - View posts list
   - View single post
   - Update post
   - Delete post
   - View settings
5. Check `server/logs/` for generated log files

### Step 2: Run Postman Collection
1. Open Postman
2. Import `Postman_Collection.json`
3. Set environment variable `base_url` to `http://localhost:5000`
4. Run the collection (all requests)
5. Export results as JSON: `postman/run-report-YYYY-MM-DD.json`

### Step 3: Take Screenshots
1. Navigate through the application
2. Take screenshots of each page listed above
3. Save to `screenshots/` directory with appropriate names

### Step 4: Final Check
- [ ] All log files generated
- [ ] Postman collection exported
- [ ] All screenshots taken
- [ ] README updated
- [ ] Code is clean and well-documented
- [ ] All features working correctly

## 📧 Submission Email

When submitting, include:
1. GitHub repository link
2. Brief description of the project
3. Note about logs, Postman collection, and screenshots location
4. Any additional notes or considerations

## 📋 Log File Contents

The log files should contain entries for:
- Authentication requests (login, signup)
- Post CRUD operations
- User profile operations
- Error scenarios (failed login, duplicate signup, etc.)

## 🎯 Evaluation Criteria Coverage

- ✅ UI/UX quality & responsiveness
- ✅ Integration between frontend & backend
- ✅ Security practices (hashed passwords, token validation)
- ✅ Code quality & documentation
- ✅ Scalability potential (project structure, modularity)
- ✅ Log files demonstrating functionality
- ✅ Postman collection for API testing
- ✅ Screenshots showing UI/UX

