# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymath Learning Companion - a personal desktop app for tracking growth across multiple domains (AI, finance, fitness, philosophy, etc.). This is NOT a generic to-do app - it's a **learning tracker** designed to help you become a polymath.

**Current Phase:** Phase 2A (Content-Aware Tasks) complete. Ready for Phase 2B (Streaks & Engagement).

## Tech Stack

- **Backend:** Python 3.13+, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS v4, shadcn/ui, React Query, React Router

## Development Commands

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm run dev  # http://localhost:5173
```

## Architecture

### Data Model

```
Domain (e.g., "AI & Machine Learning")
├── Projects (e.g., "Learn Neural Networks")
│   └── Tasks (e.g., "Watch 3Blue1Brown video")
│       └── URL field for learning content (YouTube, articles)
└── Activity Heatmap (GitHub-style, tracks task completions)
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Content-aware tasks** | YouTube links show thumbnails, articles show favicon |
| **Activity heatmap** | GitHub-style visualization per domain |
| **Per-domain progress** | Dashboard shows completion % for each domain |
| **URL detection** | Auto-detects YouTube, GitHub, PDFs, articles |

### Frontend Structure

```
frontend/src/
├── api/client.ts           # API fetch wrappers
├── lib/url-utils.ts        # URL parsing (YouTube detection, favicons)
├── types/index.ts          # TypeScript interfaces
├── hooks/                  # React Query hooks (useDomains, useProjects, useTasks)
├── features/
│   ├── domains/components/ # DomainCard, ActivityHeatmap, DomainFormDialog
│   ├── projects/components/# ProjectCard, ProjectFormDialog
│   └── tasks/components/   # TaskItem (with thumbnails), TaskFormDialog
├── pages/                  # Route components
└── App.tsx                 # Router + QueryClient setup
```

## Roadmap

### Completed
- [x] **Phase 1:** MVP Tracker (CRUD for domains, projects, tasks)
- [x] **Phase 2A:** Content-Aware Tasks
  - YouTube thumbnail previews
  - Favicon display for articles
  - Task editing
  - Activity heatmap per domain

### Next Up
- [ ] **Phase 2B:** Streaks & Engagement
  - Daily/weekly streaks per domain
  - "Streak at risk" indicators
  - Simple achievements

- [ ] **Phase 2C:** Session Logging
  - Quick "log session" action
  - Time tracking

- [ ] **Phase 3:** Spaced Repetition
  - Flashcard system
  - SM-2 algorithm

- [ ] **Phase 4-5:** AI Features
  - Quiz generation
  - YouTube transcript parsing
  - AI-generated flashcards

## Code Conventions

### Frontend
- `@/` import alias for absolute imports
- React Query for server state (auto-invalidation after mutations)
- Toast notifications via `sonner`
- URL parsing utility at `src/lib/url-utils.ts`

### Backend
- Thin routes, business logic in `crud/`
- Pydantic for validation
- SQLite for local storage

## Running the App

```bash
# Terminal 1
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173
