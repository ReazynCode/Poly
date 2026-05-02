from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from models.models import Task, Project, Domain, TaskStatus
from schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, task: TaskCreate) -> Task:
    """Create a new task within a project and domain."""
    # Verify domain exists
    domain = db.query(Domain).filter(Domain.id == task.domain_id).first()
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Domain with id {task.domain_id} not found"
        )

    # Verify project exists and belongs to the domain
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {task.project_id} not found"
        )

    if project.domain_id != task.domain_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project {task.project_id} does not belong to domain {task.domain_id}"
        )

    db_task = Task(
        project_id=task.project_id,
        domain_id=task.domain_id,
        title=task.title,
        description=task.description,
        status=task.status,
        url=task.url,
        priority=task.priority,
        due_date=task.due_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: int) -> Task:
    """Get a task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    return task


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[Task]:
    """Get all tasks with pagination."""
    return db.query(Task).offset(skip).limit(limit).all()


def get_tasks_by_project(db: Session, project_id: int, skip: int = 0, limit: int = 100) -> list[Task]:
    """Get all tasks for a specific project."""
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )

    return db.query(Task).filter(Task.project_id == project_id).offset(skip).limit(limit).all()


def get_tasks_by_domain(db: Session, domain_id: int, skip: int = 0, limit: int = 100) -> list[Task]:
    """Get all tasks for a specific domain."""
    # Verify domain exists
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Domain with id {domain_id} not found"
        )

    return db.query(Task).filter(Task.domain_id == domain_id).offset(skip).limit(limit).all()


def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Task:
    """Update a task."""
    db_task = get_task(db, task_id)

    # Verify new domain exists if provided
    if task_update.domain_id is not None:
        domain = db.query(Domain).filter(Domain.id == task_update.domain_id).first()
        if not domain:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Domain with id {task_update.domain_id} not found"
            )

    # Verify new project exists if provided
    if task_update.project_id is not None:
        project = db.query(Project).filter(Project.id == task_update.project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project with id {task_update.project_id} not found"
            )

    update_data = task_update.model_dump(exclude_unset=True)

    # TODO(human): Add status transition validation logic here
    # Consider what happens when status changes to COMPLETED

    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> dict:
    """Delete a task."""
    db_task = get_task(db, task_id)
    task_title = db_task.title

    db.delete(db_task)
    db.commit()

    return {"message": f"Task '{task_title}' deleted successfully"}


def complete_task(db: Session, task_id: int) -> Task:
    """Mark a task as completed and set completion timestamp."""
    db_task = get_task(db, task_id)

    db_task.status = TaskStatus.COMPLETED
    db_task.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_task)
    return db_task
