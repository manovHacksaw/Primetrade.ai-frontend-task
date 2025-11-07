# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "User registered",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Email already in use
- `500`: Server error

---

### Login
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Server error

---

### Get Current User
**GET** `/auth/me`

Returns the authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401`: No token or invalid token
- `404`: User not found
- `500`: Server error

---

## Post Endpoints

### Create Post
**POST** `/posts`

Creates a new post for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My First Post",
  "content": "This is the content of my post."
}
```

**Response (200):**
```json
{
  "_id": "post_id",
  "title": "My First Post",
  "content": "This is the content of my post.",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401`: Not authenticated
- `500`: Server error

---

### Get All Posts
**GET** `/posts`

Retrieves all posts belonging to the authenticated user, sorted by newest first.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "post_id",
    "title": "My First Post",
    "content": "This is the content of my post.",
    "user": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `401`: Not authenticated
- `500`: Server error

---

### Get Single Post
**GET** `/posts/:id`

Retrieves a single post by ID. Only returns posts that belong to the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Post ID

**Response (200):**
```json
{
  "_id": "post_id",
  "title": "My First Post",
  "content": "This is the content of my post.",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401`: Not authenticated
- `404`: Post not found
- `500`: Server error

---

### Update Post
**PUT** `/posts/:id`

Updates an existing post. Only allows updating posts that belong to the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Post ID

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content."
}
```

**Response (200):**
```json
{
  "_id": "post_id",
  "title": "Updated Post Title",
  "content": "Updated content.",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

**Error Responses:**
- `401`: Not authenticated
- `404`: Post not found
- `500`: Server error

---

### Delete Post
**DELETE** `/posts/:id`

Deletes a post. Only allows deleting posts that belong to the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Post ID

**Response (200):**
```json
{
  "message": "Deleted"
}
```

**Error Responses:**
- `401`: Not authenticated
- `404`: Post not found
- `500`: Server error

---

## User Endpoints

### Update Username
**PATCH** `/user/username`

Updates the username for the authenticated user. Requires password confirmation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "newUsername": "newusername",
  "password": "current_password"
}
```

**Response (200):**
```json
{
  "message": "Username updated successfully",
  "user": {
    "_id": "user_id",
    "username": "newusername",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Username already exists, empty, or invalid password
- `401`: Not authenticated
- `404`: User not found
- `500`: Server error

---

### Update Password
**PATCH** `/user/password`

Updates the password for the authenticated user. Requires verification of current password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400`: Invalid current password or weak new password (must be at least 6 characters)
- `401`: Not authenticated
- `404`: User not found
- `500`: Server error

---

## Error Response Format

All error responses follow this format:
```json
{
  "message": "Error message description"
}
```

## Status Codes

- `200`: Success
- `400`: Bad Request (validation errors, invalid input)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

