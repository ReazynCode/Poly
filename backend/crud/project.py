from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.models import Project, Domain
from schemas.project import ProjectCreate, ProjectUpdate


def create_project(db: Session, project: ProjectCreate) -> Project:
    """Create a new project within a domain."""
    # Verify domain exists
    domain = db.query(Domain).filter(Domain.id == project.domain_id).first()
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Domain with id {project.domain_id} not found"
        )

    db_project = Project(
        domain_id=project.domain_id,
        title=project.title,
        description=project.description,
        status=project.status
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_project(db: Session, project_id: int) -> Project:
    """Get a project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return project


def get_projects(db: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    """Get all projects with pagination."""
    return db.query(Project).offset(skip).limit(limit).all()


def get_projects_by_domain(db: Session, domain_id: int, skip: int = 0, limit: int = 100) -> list[Project]:
    """Get all projects for a specific domain."""
    # Verify domain exists
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Domain with id {domain_id} not found"
        )

    return db.query(Project).filter(Project.domain_id == domain_id).offset(skip).limit(limit).all()


def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Project:
    """Update a project."""
    db_project = get_project(db, project_id)

    # If changing domain, verify new domain exists
    if project_update.domain_id is not None:
        domain = db.query(Domain).filter(Domain.id == project_update.domain_id).first()
        if not domain:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Domain with id {project_update.domain_id} not found"
            )

    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int) -> dict:
    """Delete a project and all its tasks."""
    db_project = get_project(db, project_id)
    project_title = db_project.title

    db.delete(db_project)
    db.commit()

    return {"message": f"Project '{project_title}' deleted successfully"}
