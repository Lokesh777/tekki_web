# Functional Requirement Document (FRD)
## Internal Project Management System

**Version:** 1.0  
**Date:** August 30, 2026  
**Status:** Phase 1 - Planning

---

## 1. Project Overview

An internal project management tool designed for growing companies to manage projects and tasks with real-time collaboration capabilities. Multiple users can work on the same project simultaneously, with changes reflected instantly across all connected clients.

---

## 2. Core Features

### 2.1 Authentication & Authorization
| Feature | Description |
|---------|-------------|
| User Registration | New users can create accounts with email/password |
| User Login | JWT-based authentication with secure token storage |
| Session Management | Tokens stored in httpOnly cookies for security |
| Password Hashing | bcryptjs for secure password storage |

### 2.2 Project Management
| Feature | Description |
|---------|-------------|
| Create Project | Users can create new projects with name and description |
| List Projects | View all projects the user has access to |
| View Project | Detailed view of a single project with its tasks |
| Update Project | Edit project name and description |
| Delete Project | Remove project (admin/owner only) |

### 2.3 Task Management
| Feature | Description |
|---------|-------------|
| Create Task | Add tasks to a project with title, description, assignee |
| Task Status | Three statuses: Todo, In Progress, Done |
| Task Assignment | Assign tasks to team members |
| Drag & Drop | Move tasks between status columns |
| Real-time Updates | All changes broadcast to connected users instantly |

### 2.4 Real-Time Collaboration
| Feature | Description |
|---------|-------------|
| Live Updates | Task status changes appear instantly for all users |
| Socket Authentication | WebSocket connections verified with JWT |
| Room-based Broadcasting | Updates scoped to project-specific rooms |
| Offline Recovery | Late-connecting users receive current state on load |

---

## 3. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: Create/delete projects, manage users, all CRUD operations |
| **Manager** | Create projects, assign tasks, update project details |
| **Member** | View assigned projects, update task status, create tasks |

### Permission Matrix

| Action | Admin | Manager | Member |
|--------|-------|---------|--------|
| Create Project | ✅ | ✅ | ❌ |
| Delete Project | ✅ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ✅ |
| Assign Task | ✅ | ✅ | ❌ |
| Update Task Status | ✅ | ✅ | ✅ |
| Delete Task | ✅ | ✅ | ❌ |
| View Projects | ✅ | ✅ | ✅ |

---

## 4. Assumptions

1. **Internal Use Only** - This tool is for company employees only; no public registration
2. **Internet Connectivity** - Users must have stable internet for real-time features
3. **Modern Browsers** - Support for Chrome, Firefox, Edge (latest 2 versions)
4. **Email as Username** - Users authenticate with email + password
5. **Single Organization** - No multi-tenant architecture needed
6. **Maximum Team Size** - Designed for teams of 5-50 members per project
7. **Task Granularity** - Tasks are atomic units; no subtasks required

---

## 5. Out-of-Scope Items

| Feature | Reason |
|---------|--------|
| File Attachments | Can be added in v2 |
| Time Tracking | Not required for MVP |
| Comments/Discussions | Not required for MVP |
| Email Notifications | Out of scope for real-time focus |
| Mobile Apps | Web-only for this phase |
| Gantt Charts | Not required for MVP |
| Guest/External Users | Internal tool only |
| Multi-language Support | English only |
| Advanced Analytics | Basic dashboard only |

---

## 6. Success Criteria

1. Multiple users can log in simultaneously
2. Task status changes are reflected within 1 second for all connected users
3. New users joining a project see the current state immediately
4. System handles 50 concurrent users without performance degradation
5. All API responses under 200ms (excluding real-time broadcasts)

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | 99.5% uptime |
| Response Time | < 200ms API, < 1s real-time broadcast |
| Scalability | Support 100 concurrent users |
| Security | JWT auth, input validation, CORS, rate limiting |
| Data Backup | MongoDB Atlas automated backups |
