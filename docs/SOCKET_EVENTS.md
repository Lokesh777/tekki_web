# Socket Events Documentation
## Real-Time Communication

**Library:** Socket.IO  
**Namespace:** `/`

---

## 1. Connection Flow

```
┌────────┐                              ┌────────┐
│ Client │                              │ Server │
└───┬────┘                              └───┬────┘
    │                                       │
    │  1. socket.io connect                 │
    │──────────────────────────────────────>│
    │                                       │── Verify JWT
    │  2. connection established            │
    │<──────────────────────────────────────│
    │                                       │
    │  3. join-project { projectId }        │
    │──────────────────────────────────────>│
    │                                       │── Validate access
    │                                       │── Add to room
    │  4. project-state { tasks }           │
    │<──────────────────────────────────────│
    │                                       │
    │  5. task-status-change { id, status } │
    │──────────────────────────────────────>│
    │                                       │── Update DB
    │  6. task-updated { task }             │
    │<──────────────────────────────────────│── Broadcast to room
    │                                       │
```

---

## 2. Client → Server Events

### connect
Establish WebSocket connection with authentication.

```javascript
const socket = io('https://your-backend.onrender.com', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIs...'
  }
});
```

### join-project
Join a project room to receive real-time updates.

**Payload:**
```javascript
socket.emit('join-project', { projectId: '64f1a2b3c4d5e6f7a8b9c0d2' });
```

**Server Action:**
1. Verify user has access to project
2. Add socket to room `project:{projectId}`
3. Emit current project state

### leave-project
Leave a project room.

**Payload:**
```javascript
socket.emit('leave-project', { projectId: '64f1a2b3c4d5e6f7a8b9c0d2' });
```

### disconnect
Handle disconnection.

```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

---

## 3. Server → Client Events

### project-state
Full project state sent after joining a room.

**Payload:**
```javascript
{
  projectId: '64f1a2b3c4d5e6f7a8b9c0d2',
  tasks: [
    {
      _id: '64f1a2b3c4d5e6f7a8b9c0d5',
      title: 'Design homepage',
      status: 'todo',
      priority: 'high',
      assignee: { _id: '...', name: 'Jane' }
    }
  ],
  members: [...]
}
```

### task-created
Broadcast when a new task is created.

**Payload:**
```javascript
{
  task: {
    _id: '64f1a2b3c4d5e6f7a8b9c0d6',
    title: 'New task',
    status: 'todo',
    priority: 'medium',
    project: '64f1a2b3c4d5e6f7a8b9c0d2',
    assignee: { _id: '...', name: 'John' },
    createdBy: { _id: '...', name: 'Admin' },
    createdAt: '2026-08-30T12:00:00Z'
  },
  createdBy: 'Admin User'
}
```

### task-updated
Broadcast when a task is updated.

**Payload:**
```javascript
{
  task: {
    _id: '64f1a2b3c4d5e6f7a8b9c0d5',
    title: 'Updated title',
    description: 'Updated description',
    priority: 'low',
    assignee: { _id: '...', name: 'Jane' }
  },
  updatedBy: 'John Doe'
}
```

### task-status-changed
Broadcast when task status changes (most frequent event).

**Payload:**
```javascript
{
  task: {
    _id: '64f1a2b3c4d5e6f7a8b9c0d5',
    title: 'Design homepage',
    status: 'in-progress',
    previousStatus: 'todo'
  },
  changedBy: 'Jane Smith'
}
```

### task-deleted
Broadcast when a task is deleted.

**Payload:**
```javascript
{
  taskId: '64f1a2b3c4d5e6f7a8b9c0d5',
  projectId: '64f1a2b3c4d5e6f7a8b9c0d2',
  deletedBy: 'Admin User'
}
```

### error
Server error notification.

**Payload:**
```javascript
{
  message: 'Access denied to this project',
  code: 'AUTH_ERROR'
}
```

---

## 4. Socket Authentication

### Server-Side Middleware
```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});
```

### Client-Side Connection
```javascript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  auth: { token: localStorage.getItem('token') },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
```

---

## 5. Error Handling

### Connection Errors
```javascript
socket.on('connect_error', (err) => {
  if (err.message === 'Authentication required') {
    // Redirect to login
  }
  if (err.message === 'Invalid token') {
    // Refresh token or logout
  }
});
```

### Reconnection Logic
```javascript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  // Rejoin all project rooms
});

socket.on('reconnect_failed', () => {
  console.log('Failed to reconnect');
  // Show offline message
});
```

---

## 6. Room Management

### Joining Multiple Projects
```javascript
const joinedRooms = new Set();

function joinProject(projectId) {
  if (!joinedRooms.has(projectId)) {
    socket.emit('join-project', { projectId });
    joinedRooms.add(projectId);
  }
}

function leaveProject(projectId) {
  socket.emit('leave-project', { projectId });
  joinedRooms.delete(projectId);
}
```

### Cleanup on Disconnect
```javascript
socket.on('disconnect', () => {
  joinedRooms.clear();
});
```

---

## 7. Event Lifecycle Summary

| Step | Event | Direction | Data |
|------|-------|-----------|------|
| 1 | connect | Client → Server | Token |
| 2 | join-project | Client → Server | projectId |
| 3 | project-state | Server → Client | tasks[], members[] |
| 4 | task-status-change | Client → Server | taskId, status |
| 5 | task-updated | Server → Client | updatedTask |
| 6 | disconnect | Client → Server | - |
