from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.domain import DomainCreate, DomainUpdate, DomainResponse
import crud

router = APIRouter(
    prefix="/domains",
    tags=["domains"]
)


@router.post("/", response_model=DomainResponse, status_code=status.HTTP_201_CREATED)
def create_domain(domain: DomainCreate, db: Session = Depends(get_db)):
    """
    Create a new learning domain.

    A domain represents a top-level area of knowledge (e.g., AI, Finance, Fitness).
    """
    return crud.create_domain(db=db, domain=domain)


@router.get("/", response_model=List[DomainResponse])
def read_domains(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all domains with pagination.
    """
    return crud.get_domains(db=db, skip=skip, limit=limit)


@router.get("/{domain_id}", response_model=DomainResponse)
def read_domain(domain_id: int, db: Session = Depends(get_db)):
    """
    Get a specific domain by ID.
    """
    return crud.get_domain(db=db, domain_id=domain_id)


@router.put("/{domain_id}", response_model=DomainResponse)
def update_domain(domain_id: int, domain: DomainUpdate, db: Session = Depends(get_db)):
    """
    Update a domain.
    """
    return crud.update_domain(db=db, domain_id=domain_id, domain_update=domain)


@router.delete("/{domain_id}")
def delete_domain(domain_id: int, db: Session = Depends(get_db)):
    """
    Delete a domain and all its associated projects and tasks.
    """
    return crud.delete_domain(db=db, domain_id=domain_id)
