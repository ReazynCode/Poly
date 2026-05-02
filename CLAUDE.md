# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymath Learning Companion - a productivity and learning app for tracking growth across multiple domains (AI, finance, fitness, philosophy, etc.). Currently in **Phase 1: MVP Tracker** with basic CRUD for domains, projects, and tasks.

**Important:** Do NOT build Phase 2+ features (AI quizzes, flashcards, spaced repetition, YouTube parsing, streaks, etc.) unless explicitly requested.

## Tech Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS v4, shadcn/ui, React Query, React Router

## Development Commands

### Backend

```bash
cd backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API docs available at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev  # Runs on http://localhost:5173

# Build for production
npm run build
```

## Architecture

### Backend Structure

```
backend/
├── main.py           # FastAPI app entry, CORS config, router registration
├── database.py       # SQLite engine + session factory + get_db dependency
├── models/
│   └── models.py     # SQLAlchemy ORM models (Domain, Project, Task)
├── schemas/          # Pydantic request/response validation
├── crud/             # Database operations (business logic lives here)
└── routes/           # HTTP endpoint handlers (thin layer calling crud)
```

**Data flow:** Route handler → CRUD function → SQLAlchemy model → SQLite

### Frontend Structure

```
frontend/src/
├── api/client.ts           # API fetch wrappers (domainApi, projectApi, taskApi)
├── types/index.ts          # TypeScript interfaces matching backend schemas
├── hooks/                  # React Query hooks
│   ├── useDomains.ts       # useQuery/useMutation for domains
│   ├── useProjects.ts      # useQuery/useMutation for projects
│   └── useTasks.ts         # useQuery/useMutation for tasks
├── layouts/MainLayout.tsx  # App shell with nav + Outlet
├── features/
│   ├── domains/components/ # DomainCard, DomainList, DomainFormDialog, DeleteConfirmDialog
│   ├── projects/components/# ProjectCard, ProjectList, ProjectFormDialog
│   └── tasks/components/   # TaskItem, TaskList, TaskFormDialog
├── pages/                  # Route components
│   ├── DashboardPage.tsx   # Stats overview with progress bar
│   ├── DomainsPage.tsx     # Domain list + create
│   ├── DomainDetailPage.tsx# Domain view + projects list
│   └── ProjectDetailPage.tsx# Project view + tasks list
├── components/ui/          # shadcn components (auto-generated)
└── App.tsx                 # QueryClientProvider + BrowserRouter + Routes
```

**Data flow:** Page → useQuery hook → api/client.ts → fetch → Backend API

### Key Relationships

- **Domain** → has many **Projects** → has many **Tasks**
- Tasks have a denormalized `domain_id` for faster queries (intentional design for future phases)
- All cascade deletes are configured via SQLAlchemy relationships

### API Endpoints

All routes prefixed with `/api`:

| Resource | Endpoints |
|----------|-----------|
| Domains | `GET/POST /domains`, `GET/PUT/DELETE /domains/{id}` |
| Projects | `GET/POST /projects`, `GET/PUT/DELETE /projects/{id}`, `GET /projects/by-domain/{id}` |
| Tasks | `GET/POST /tasks`, `GET/PUT/DELETE /tasks/{id}`, `POST /tasks/{id}/complete`, `GET /tasks/by-project/{id}`, `GET /tasks/by-domain/{id}` |

## Phase 1 Checklist

- [x] Domain CRUD (backend)
- [x] Project CRUD (backend)
- [x] Task CRUD + complete endpoint (backend)
- [x] Frontend implementation
- [x] Progress calculation (completed/total tasks)
- [x] Basic dashboard

## Design Decisions

1. **Task `url` field exists but unused** - Reserved for Phase 5 YouTube/article parsing
2. **Task `domain_id` is denormalized** - Duplicates project's domain_id for query performance
3. **SQLite for MVP** - Simple local storage, will migrate to Postgres later
4. **No auth in Phase 1** - Single-user local app for now
5. **React Query for server state** - Automatic caching, refetching, and cache invalidation
6. **shadcn/ui components** - Consistent styling with TailwindCSS, accessible by default

## Code Conventions

### Backend
- Use Pydantic's `model_dump(exclude_unset=True)` for partial updates
- Routes should be thin; business logic goes in crud/
- Always verify foreign key references exist before create/update
- Return proper HTTP status codes (201 for create, 404 for not found)

### Frontend
- Use React Query's `useQuery` for GET requests, `useMutation` for POST/PUT/DELETE
- Invalidate queries after mutations: `queryClient.invalidateQueries({ queryKey: ['domains'] })`
- Toast notifications via `sonner` for user feedback
- Form dialogs reset state when opened via `useEffect` on `open` prop
- Use `@/` import alias for absolute imports from src/

## Running Both Services

```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Then open http://localhost:5173 in your browser.
