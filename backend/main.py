from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import domains_router, projects_router, tasks_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Polymath Learning Companion API",
    description="""
    A domain-based learning tracker that helps users organize, practice,
    and retain knowledge across multiple areas of life.

    ## Features
    - **Domains**: Top-level learning areas (AI, Finance, Fitness, etc.)
    - **Projects**: Focused goals within domains
    - **Tasks**: Action items within projects (can include learning content URLs)

    ## Phase 1 - MVP
    Basic CRUD operations for domains, projects, and tasks.
    """,
    version="0.1.0"
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(domains_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "message": "Polymath Learning Companion API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check for monitoring."""
    return {"status": "healthy"}
