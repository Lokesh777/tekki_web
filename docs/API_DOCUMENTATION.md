# API Documentation
## Internal Project Management System

**Base URL:** `https://your-backend.onrender.com/api`

---

## Authentication Headers

All authenticated requests require:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Auth Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "member",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /api/auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "member",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### GET /api/auth/me
Get current logged-in user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "member"
  }
}
```

---

## 2. Project Endpoints

### GET /api/projects
List all projects user has access to.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Website Redesign",
      "description": "Complete overhaul of company website",
      "owner": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe"
      },
      "members": [
        {
          "user": {
            "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
            "name": "Jane Smith"
          },
          "role": "member"
        }
      ],
      "taskCount": 12,
      "createdAt": "2026-08-30T10:00:00.000Z"
    }
  ]
}
```

### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Mobile App",
  "description": "Build company mobile application"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Mobile App",
    "description": "Build company mobile application",
    "owner": "64f1a2b3c4d5e6f7a8b9c0d1",
    "members": [],
    "createdAt": "2026-08-30T12:00:00.000Z"
  }
}
```

### GET /api/projects/:id
Get single project details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "owner": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@company.com"
    },
    "members": [...],
    "tasks": [...]
  }
}
```

### PUT /api/projects/:id
Update project details.

**Request Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description"
}
```

### DELETE /api/projects/:id
Delete a project (owner/admin only).

**Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Project deleted successfully"
}
```

---

## 3. Task Endpoints

### GET /api/projects/:projectId/tasks
List all tasks in a project.

**Query Parameters:**
- `status` - Filter by status (todo, in-progress, done)
- `assignee` - Filter by assignee ID

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "title": "Design homepage mockup",
      "description": "Create wireframes and high-fidelity mockups",
      "status": "todo",
      "priority": "high",
      "assignee": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Jane Smith"
      },
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe"
      },
      "dueDate": "2026-09-15T00:00:00.000Z",
      "createdAt": "2026-08-30T10:00:00.000Z"
    }
  ]
}
```

### POST /api/projects/:projectId/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Design homepage mockup",
  "description": "Create wireframes and high-fidelity mockups",
  "priority": "high",
  "assignee": "64f1a2b3c4d5e6f7a8b9c0d3",
  "dueDate": "2026-09-15"
}
```

### PUT /api/tasks/:id
Update a task.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "low",
  "assignee": "64f1a2b3c4d5e6f7a8b9c0d4"
}
```

### PATCH /api/tasks/:id/status
Update task status (triggers real-time broadcast).

**Request Body:**
```json
{
  "status": "in-progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "title": "Design homepage mockup",
    "status": "in-progress",
    ...
  }
}
```

### DELETE /api/tasks/:id
Delete a task.

---

## 4. Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": "You do not have permission to perform this action"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```
