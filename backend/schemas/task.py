from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class TaskStatus(str, Enum):
    """Task status options."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskIntent(str, Enum):
    """Task intent - passive learning or active work."""
    PASSIVE = "passive"  # Consuming content (watching, reading, listening)
    WORK = "work"        # Active work (building, practicing, creating)


class TaskBase(BaseModel):
    """Base schema with shared task attributes."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    status: Optional[TaskStatus] = Field(TaskStatus.PENDING, description="Task status")
    intent: Optional[TaskIntent] = Field(TaskIntent.WORK, description="Task intent - passive or work")
    url: Optional[str] = Field(None, max_length=500, description="Learning content URL (for passive tasks)")
    priority: Optional[TaskPriority] = Field(TaskPriority.MEDIUM, description="Task priority")
    due_date: Optional[datetime] = Field(None, description="Task due date")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    project_id: int = Field(..., description="ID of the parent project")
    domain_id: int = Field(..., description="ID of the parent domain")


class TaskUpdate(BaseModel):
    """Schema for updating a task. All fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    intent: Optional[TaskIntent] = None
    url: Optional[str] = Field(None, max_length=500)
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    project_id: Optional[int] = None
    domain_id: Optional[int] = None


class TaskResponse(TaskBase):
    """Schema for task response with all fields."""
    id: int
    project_id: int
    domain_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
