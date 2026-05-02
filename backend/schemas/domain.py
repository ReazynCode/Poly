from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class DomainBase(BaseModel):
    """Base schema with shared domain attributes."""
    name: str = Field(..., min_length=1, max_length=100, description="Domain name")
    description: Optional[str] = Field(None, description="Domain description")
    color: Optional[str] = Field("#3B82F6", pattern=r"^#[0-9A-Fa-f]{6}$", description="Hex color code")


class DomainCreate(DomainBase):
    """Schema for creating a new domain."""
    pass


class DomainUpdate(BaseModel):
    """Schema for updating a domain. All fields optional."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class DomainResponse(DomainBase):
    """Schema for domain response with all fields."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
