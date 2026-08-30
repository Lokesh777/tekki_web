# Tekki PM - Internal Project Management System

A real-time collaborative project management tool built for growing companies.

**Live URLs:**
- Frontend: https://frontend-nu-murex-xmxjk54pz3.vercel.app/
- Backend API: https://tekki-web.onrender.com

---

## Features

- **Authentication** - Secure JWT-based login/registration
- **Project Management** - Create, view, update, and delete projects
- **Task Management** - Create tasks with priorities and assignments
- **Real-time Updates** - See changes instantly across all connected users
- **Role-based Access** - Admin, Manager, and Member permissions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Zustand, Tailwind CSS |
| Backend | Node.js, Express.js, MongoDB |
| Real-time | Socket.IO |
| Auth | JWT (JSON Web Tokens) |
| Cache | Redis |
| Hosting | Render (Backend), Netlify (Frontend) |

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Redis (optional for local dev)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm install
npm run dev
```

---

## Project Structure

```
tekki_webSol/
├── docs/                    # Documentation
│   ├── FRD.md              # Functional Requirements
│   ├── SYSTEM_DESIGN.md    # Architecture & Design
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SOCKET_EVENTS.md
│   ├── DEPLOYMENT.md
│   └── CLOSEUP.md
├── backend/                 # Node.js API
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── services/       # Business logic
│       ├── routes/         # API routes
│       ├── models/         # MongoDB schemas
│       ├── sockets/        # Socket.IO handlers
│       ├── middleware/      # Auth, validation, errors
│       ├── config/         # DB, Redis, env config
│       └── app.js          # Entry point
├── frontend/                # Next.js app
│   └── src/
│       ├── app/            # Pages (App Router)
│       ├── components/     # Reusable components
│       ├── lib/            # API & Socket services
│       ├── store/          # Zustand state
│       └── hooks/          # Custom hooks
└── .github/workflows/      # CI/CD pipeline
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/projects/:id/tasks | List tasks |
| POST | /api/projects/:id/tasks | Create task |
| PATCH | /api/tasks/:id/status | Update task status |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join-project | Client → Server | Join project room |
| leave-project | Client → Server | Leave project room |
| project-state | Server → Client | Full project data |
| task-status-changed | Server → Client | Status update broadcast |
| task-created | Server → Client | New task broadcast |
| task-updated | Server → Client | Task update broadcast |
| task-deleted | Server → Client | Task deletion broadcast |

---

## Documentation

- [Functional Requirements](docs/FRD.md)
- [System Design](docs/SYSTEM_DESIGN.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Socket Events](docs/SOCKET_EVENTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Project Closeup](docs/CLOSEUP.md)

---

## License

ISC
