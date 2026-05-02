from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
import crud

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """
    Create a new project within a domain.

    A project represents a focused goal within a domain
    (e.g., 'Understand Bonds and Stocks' within Finance).
    """
    return crud.create_project(db=db, project=project)


@router.get("/", response_model=List[ProjectResponse])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all projects with pagination.
    """
    return crud.get_projects(db=db, skip=skip, limit=limit)


@router.get("/by-domain/{domain_id}", response_model=List[ProjectResponse])
def read_projects_by_domain(domain_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all projects for a specific domain.
    """
    return crud.get_projects_by_domain(db=db, domain_id=domain_id, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(project_id: int, db: Session = Depends(get_db)):
    """
    Get a specific project by ID.
    """
    return crud.get_project(db=db, project_id=project_id)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)):
    """
    Update a project.
    """
    return crud.update_project(db=db, project_id=project_id, project_update=project)


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """
    Delete a project and all its associated tasks.
    """
    return crud.delete_project(db=db, project_id=project_id)
