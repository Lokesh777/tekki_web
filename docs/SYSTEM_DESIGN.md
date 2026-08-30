# System Design Document
## Internal Project Management System

**Version:** 1.0  
**Date:** August 30, 2026

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Browser 1  │  │  Browser 2  │  │  Browser N  │            │
│  │  (React)    │  │  (React)    │  │  (React)    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                                 │
│                   (Nginx / Render)                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API SERVER (Node.js)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Express Router                         │   │
│  └──────────┬──────────────┬──────────────┬────────────────┘   │
│             │              │              │                      │
│  ┌──────────▼──────┐ ┌────▼────┐ ┌───────▼────────┐           │
│  │   Controllers   │ │ Sockets │ │   Middleware     │           │
│  │   (HTTP)        │ │  (WS)   │ │   (Auth/Valid)  │           │
│  └──────────┬──────┘ └────┬────┘ └───────┬────────┘           │
│             │              │              │                      │
│  ┌──────────▼──────────────▼──────────────▼────────────┐       │
│  │                  Services Layer                       │       │
│  │   (Business Logic + Data Access)                     │       │
│  └──────────┬────────────────────────┬─────────────────┘       │
│             │                        │                          │
└─────────────┼────────────────────────┼──────────────────────────┘
              │                        │
              ▼                        ▼
┌─────────────────────┐    ┌─────────────────────┐
│     MongoDB         │    │       Redis          │
│   (Primary DB)      │    │   (Session Cache)    │
│                     │    │                      │
│  - Users            │    │  - Token Blacklist   │
│  - Projects         │    │  - Connected Users   │
│  - Tasks            │    │                      │
└─────────────────────┘    └─────────────────────┘
```

---

## 2. API Endpoints

### 2.1 Authentication

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### 2.2 Projects

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/projects` | List all user's projects | Yes |
| POST | `/api/projects` | Create new project | Yes |
| GET | `/api/projects/:id` | Get project details | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |

### 2.3 Tasks

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/projects/:projectId/tasks` | List project tasks | Yes |
| POST | `/api/projects/:projectId/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### 2.4 Socket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `join-project` | Client → Server | Join project room |
| `leave-project` | Client → Server | Leave project room |
| `task-created` | Server → Client | Broadcast new task |
| `task-updated` | Server → Client | Broadcast task update |
| `task-status-changed` | Server → Client | Broadcast status change |
| `task-deleted` | Server → Client | Broadcast task deletion |

---

## 3. Database Schema

### 3.1 Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'manager', 'member'], default: 'member'),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 Projects Collection
```javascript
{
  _id: ObjectId,
  name: String (required, trim, maxlength: 100),
  description: String (trim, maxlength: 500),
  owner: ObjectId (ref: 'User', required),
  members: [{
    user: ObjectId (ref: 'User'),
    role: String (enum: ['admin', 'manager', 'member'])
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String (required, trim, maxlength: 200),
  description: String (trim, maxlength: 1000),
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  project: ObjectId (ref: 'Project', required),
  assignee: ObjectId (ref: 'User'),
  createdBy: ObjectId (ref: 'User', required),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. Real-Time Communication Strategy

### 4.1 Architecture Choice: Socket.IO

**Why Socket.IO over raw WebSockets:**
- Automatic fallback to long-polling
- Built-in room/namespace support
- Event-based abstraction (simpler than raw message handling)
- Built-in reconnection logic
- Middleware support for authentication

### 4.2 Connection Flow

```
Client                          Server
  │                               │
  │──── connect ─────────────────>│
  │                               │── Verify JWT token
  │<──── authenticated ───────────│
  │                               │
  │──── join-project {id} ───────>│
  │                               │── Add to room
  │<──── project-state ───────────│── Send current state
  │                               │
  │──── task-status-change ──────>│
  │                               │── Update DB
  │                               │── Broadcast to room
  │<──── task-updated ────────────│── All clients in room
```

### 4.3 Room Strategy

- Each project has a Socket.IO room: `project:{projectId}`
- When user connects, they authenticate via JWT
- Client emits `join-project` with projectId
- Server validates user has access, adds to room
- All task broadcasts are scoped to project room

### 4.4 Data Consistency

1. **Optimistic Updates** - Client updates UI immediately
2. **Server Validation** - Server validates and confirms/rejects
3. **Database as Source of Truth** - Always fetch from DB on conflicts
4. **Event Ordering** - Socket.IO guarantees per-connection ordering

---

## 5. Why This Approach Was Chosen

| Decision | Rationale |
|----------|-----------|
| **Socket.IO** | Battle-tested, room support, auto-reconnect |
| **JWT in httpOnly cookies** | Prevents XSS attacks, secure by default |
| **Service Layer Pattern** | Separates business logic from HTTP/socket handling |
| **Zustand for State** | Minimal boilerplate, perfect for real-time subscriptions |
| **MongoDB** | Flexible schema, excellent for rapid development |
| **Redis** | Fast session store, enables future scaling |
| **Render + Netlify** | Free tier sufficient, easy deployment |

---

## 6. Scalability Considerations

### 6.1 Current Design (MVP)
- Single server instance handles all connections
- MongoDB Atlas handles database scaling
- Redis for session caching

### 6.2 Future Scaling Options

| Component | Scaling Strategy |
|-----------|------------------|
| **API Servers** | Horizontal scaling with load balancer |
| **Socket.IO** | Redis adapter for multi-server pub/sub |
| **Database** | Read replicas, sharding |
| **Cache** | Redis Cluster |

### 6.3 Bottleneck Analysis

| Bottleneck | Mitigation |
|------------|------------|
| WebSocket connections | Use Redis adapter for multi-server |
| Database writes | Connection pooling, indexing |
| Memory | Limit concurrent rooms per server |

---

## 7. Security Design

| Layer | Implementation |
|-------|----------------|
| **Transport** | HTTPS everywhere (SSL via Let's Encrypt) |
| **Authentication** | JWT with short expiry (1h), refresh tokens |
| **Authorization** | Role-based access control (RBAC) |
| **Input** | Express-validator for all endpoints |
| **Headers** | Helmet.js for security headers |
| **CORS** | Whitelist frontend domain only |
| **Rate Limiting** | Prevent brute-force attacks |
