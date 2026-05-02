from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
import crud

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task within a project.

    Tasks can be regular tasks or learning tasks (with a URL for content).
    The URL field enables future AI features like quiz/flashcard generation.
    """
    return crud.create_task(db=db, task=task)


@router.get("/", response_model=List[TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all tasks with pagination.
    """
    return crud.get_tasks(db=db, skip=skip, limit=limit)


@router.get("/by-project/{project_id}", response_model=List[TaskResponse])
def read_tasks_by_project(project_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all tasks for a specific project.
    """
    return crud.get_tasks_by_project(db=db, project_id=project_id, skip=skip, limit=limit)


@router.get("/by-domain/{domain_id}", response_model=List[TaskResponse])
def read_tasks_by_domain(domain_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all tasks for a specific domain.
    """
    return crud.get_tasks_by_domain(db=db, domain_id=domain_id, skip=skip, limit=limit)


@router.get("/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    """
    Get a specific task by ID.
    """
    return crud.get_task(db=db, task_id=task_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    """
    Update a task.
    """
    return crud.update_task(db=db, task_id=task_id, task_update=task)


@router.post("/{task_id}/complete", response_model=TaskResponse)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Mark a task as completed.

    This sets the status to COMPLETED and records the completion timestamp.
    This endpoint will be important for triggering future AI workflows
    (e.g., extracting content from YouTube URLs when a learning task is completed).
    """
    return crud.complete_task(db=db, task_id=task_id)


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a task.
    """
    return crud.delete_task(db=db, task_id=task_id)
