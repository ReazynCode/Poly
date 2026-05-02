from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class ProjectStatus(str, Enum):
    """Project status options."""
    ACTIVE = "active"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    ARCHIVED = "archived"


class ProjectBase(BaseModel):
    """Base schema with shared project attributes."""
    title: str = Field(..., min_length=1, max_length=200, description="Project title")
    description: Optional[str] = Field(None, description="Project description")
    status: Optional[ProjectStatus] = Field(ProjectStatus.ACTIVE, description="Project status")


class ProjectCreate(ProjectBase):
    """Schema for creating a new project."""
    domain_id: int = Field(..., description="ID of the parent domain")


class ProjectUpdate(BaseModel):
    """Schema for updating a project. All fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    domain_id: Optional[int] = None


class ProjectResponse(ProjectBase):
    """Schema for project response with all fields."""
    id: int
    domain_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
