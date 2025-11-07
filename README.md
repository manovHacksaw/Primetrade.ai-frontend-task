# Primetrade.ai Frontend Developer Assignment

A full-stack web application built with Next.js (frontend) and Node.js/Express (backend) featuring authentication, dashboard, and CRUD operations for blog posts.

## 🚀 Features

### Frontend
- ✅ **Next.js 16** with React 19 and TypeScript
- ✅ **Responsive Design** using TailwindCSS with custom CSS variables
- ✅ **Dark/Light Theme** support with theme switcher
- ✅ **Form Validation** (client-side and server-side)
- ✅ **Protected Routes** (login required for dashboard and posts)
- ✅ **Rich Text Editor** for post content (TipTap)
- ✅ **Search & Filter** functionality for posts
- ✅ **Smooth Animations** using Framer Motion

### Backend
- ✅ **Node.js/Express** REST API
- ✅ **MongoDB** database with Mongoose ODM
- ✅ **JWT Authentication** with secure token management
- ✅ **Password Hashing** using bcrypt
- ✅ **Protected API Routes** with authentication middleware
- ✅ **Error Handling** and validation

### Core Functionality
- ✅ User registration and login
- ✅ User profile management (username and password update)
- ✅ CRUD operations for posts (Create, Read, Update, Delete)
- ✅ Dashboard with user stats and recent posts
- ✅ Search and filter posts by title/content
- ✅ Logout functionality

## 📁 Project Structure

```
prime-trade-assignment/
├── client/                 # Next.js frontend application
│   ├── app/                # Next.js app router pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── posts/          # Posts listing page
│   │   ├── post/           # Post detail, create, edit pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── settings/       # User settings page
│   ├── components/         # React components
│   └── lib/                # Utility functions (auth, axios)
├── server/                 # Express backend application
│   └── src/
│       ├── routes/         # API route handlers
│       ├── models/         # MongoDB models
│       ├── middleware/     # Authentication middleware
│       └── config/         # Database configuration
├── API_DOCUMENTATION.md    # Complete API documentation
└── SCALING_NOTES.md        # Production scaling strategies
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your-secret-key-here-change-in-production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Overview

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

**Posts:**
- `GET /posts` - Get all user's posts (protected)
- `GET /posts/:id` - Get single post (protected)
- `POST /posts` - Create new post (protected)
- `PUT /posts/:id` - Update post (protected)
- `DELETE /posts/:id` - Delete post (protected)

**User:**
- `PATCH /user/username` - Update username (protected)
- `PATCH /user/password` - Update password (protected)

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Both frontend and backend route protection
- **Input Validation**: Client-side and server-side validation
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and user feedback

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: User preference with system detection
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Loading States**: Skeleton loaders and loading indicators
- **Error Messages**: Clear and user-friendly error messages
- **Form Validation**: Real-time validation with helpful error messages

## 📊 Dashboard Features

- User welcome message with username
- Statistics cards (Total Posts, Updated This Week)
- Recent posts list (last 5 posts)
- Quick actions (Create Post, View All Posts)

## 🔍 Search & Filter

- Real-time search across post titles and content
- Case-insensitive search
- Instant filtering as you type

## 📝 Post Management

- Create posts with rich text editor
- Edit existing posts
- Delete posts with confirmation
- View individual post details
- All posts are user-specific (users can only see/edit their own posts)

## 🚀 Production Deployment

For production deployment considerations and scaling strategies, see [SCALING_NOTES.md](./SCALING_NOTES.md)

### Key Production Considerations:
- Environment variables for sensitive data
- HTTPS enforcement
- Rate limiting
- Database indexing
- Caching strategies (Redis)
- CDN for static assets
- Monitoring and logging
- Horizontal scaling

## 🧪 Testing

To test the application:

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register a new account
4. Create, edit, and delete posts
5. Test search functionality
6. Update profile settings

## 📦 Dependencies

### Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- TipTap (Rich Text Editor)
- Axios

### Backend
- Express.js
- MongoDB/Mongoose
- JWT
- bcrypt
- CORS
- dotenv

## 📄 License

This project is part of a coding assignment for Primetrade.ai.

## 👤 Author

Frontend Developer Intern Candidate

---

**Note**: This is a demonstration project built for the Primetrade.ai Frontend Developer Intern position. All features required by the assignment have been implemented with attention to code quality, security, and scalability.
