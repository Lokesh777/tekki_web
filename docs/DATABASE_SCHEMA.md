# Database Schema Design
## MongoDB Collections

**Database:** `project_management`  
**ORM:** Mongoose

---

## 1. Users Collection

```
┌─────────────────────────────────────────────────────┐
│                    users                             │
├─────────────────────────────────────────────────────┤
│ _id          │ ObjectId    │ PK, auto-generated     │
│ name         │ String      │ required, trim          │
│ email        │ String      │ required, unique, lower │
│ password     │ String      │ required, hashed        │
│ role         │ String      │ enum: admin/manager/member │
│ createdAt    │ Date        │ auto                    │
│ updatedAt    │ Date        │ auto                    │
└─────────────────────────────────────────────────────┘
```

**Indexes:**
- `email: 1` (unique)

**Example Document:**
```json
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "name": "John Doe",
  "email": "john@company.com",
  "password": "$2a$10$hashedpassword...",
  "role": "admin",
  "createdAt": ISODate("2026-08-30T10:00:00Z"),
  "updatedAt": ISODate("2026-08-30T10:00:00Z")
}
```

---

## 2. Projects Collection

```
┌─────────────────────────────────────────────────────┐
│                   projects                           │
├─────────────────────────────────────────────────────┤
│ _id          │ ObjectId    │ PK, auto-generated     │
│ name         │ String      │ required, trim, max:100 │
│ description  │ String      │ trim, max:500           │
│ owner        │ ObjectId    │ FK -> users._id         │
│ members      │ Array       │ [{user, role}]          │
│ createdAt    │ Date        │ auto                    │
│ updatedAt    │ Date        │ auto                    │
└─────────────────────────────────────────────────────┘
```

**Indexes:**
- `owner: 1`
- `members.user: 1`

**Example Document:**
```json
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d2"),
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "owner": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "members": [
    {
      "user": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
      "role": "admin"
    },
    {
      "user": ObjectId("64f1a2b3c4d5e6f7a8b9c0d3"),
      "role": "member"
    }
  ],
  "createdAt": ISODate("2026-08-30T10:00:00Z"),
  "updatedAt": ISODate("2026-08-30T10:00:00Z")
}
```

---

## 3. Tasks Collection

```
┌─────────────────────────────────────────────────────┐
│                     tasks                            │
├─────────────────────────────────────────────────────┤
│ _id          │ ObjectId    │ PK, auto-generated     │
│ title        │ String      │ required, trim, max:200 │
│ description  │ String      │ trim, max:1000          │
│ status       │ String      │ enum: todo/in-progress/done │
│ priority     │ String      │ enum: low/medium/high   │
│ project      │ ObjectId    │ FK -> projects._id      │
│ assignee     │ ObjectId    │ FK -> users._id         │
│ createdBy    │ ObjectId    │ FK -> users._id         │
│ dueDate      │ Date        │ optional                │
│ createdAt    │ Date        │ auto                    │
│ updatedAt    │ Date        │ auto                    │
└─────────────────────────────────────────────────────┘
```

**Indexes:**
- `project: 1`
- `assignee: 1`
- `status: 1`
- `project: 1, status: 1` (compound)

**Example Document:**
```json
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d5"),
  "title": "Design homepage mockup",
  "description": "Create wireframes and high-fidelity mockups",
  "status": "todo",
  "priority": "high",
  "project": ObjectId("64f1a2b3c4d5e6f7a8b9c0d2"),
  "assignee": ObjectId("64f1a2b3c4d5e6f7a8b9c0d3"),
  "createdBy": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "dueDate": ISODate("2026-09-15T00:00:00Z"),
  "createdAt": ISODate("2026-08-30T10:00:00Z"),
  "updatedAt": ISODate("2026-08-30T10:00:00Z")
}
```

---

## 4. Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users     │         │   Projects   │         │    Tasks     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ _id (PK)     │◄────────│ owner (FK)   │◄────────│ project (FK) │
│ name         │         │ _id (PK)     │         │ _id (PK)     │
│ email        │         │ name         │         │ title        │
│ password     │         │ description  │         │ description  │
│ role         │         │ members[]    │         │ status       │
│ createdAt    │         │ createdAt    │         │ priority     │
│ updatedAt    │         │ updatedAt    │         │ assignee(FK) │
└──────────────┘         └──────────────┘         │ createdBy(FK)│
       ▲                                          │ dueDate      │
       │                                          │ createdAt    │
       └──────────────────────────────────────────│ updatedAt    │
                                                  └──────────────┘
```

---

## 5. Mongoose Schemas

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false  // Don't return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'member'],
    default: 'member'
  }
}, { timestamps: true });
```

### Project Schema
```javascript
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'member'],
      default: 'member'
    }
  }]
}, { timestamps: true });
```

### Task Schema
```javascript
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });
```

---

## 6. Seed Data

### Default Admin User
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "admin123",
  "role": "admin"
}
```

### Sample Project
```json
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "owner": "admin_user_id",
  "members": [
    { "user": "admin_user_id", "role": "admin" }
  ]
}
```

### Sample Tasks
```json
[
  { "title": "Create wireframes", "status": "todo", "priority": "high" },
  { "title": "Design mockups", "status": "todo", "priority": "medium" },
  { "title": "Setup project repo", "status": "done", "priority": "high" }
]
```
