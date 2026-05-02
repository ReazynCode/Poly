from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from models.models import Domain
from schemas.domain import DomainCreate, DomainUpdate


def create_domain(db: Session, domain: DomainCreate) -> Domain:
    """Create a new domain."""
    db_domain = Domain(
        name=domain.name,
        description=domain.description,
        color=domain.color
    )
    try:
        db.add(db_domain)
        db.commit()
        db.refresh(db_domain)
        return db_domain
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Domain with name '{domain.name}' already exists"
        )


def get_domain(db: Session, domain_id: int) -> Domain:
    """Get a domain by ID."""
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Domain with id {domain_id} not found"
        )
    return domain


def get_domains(db: Session, skip: int = 0, limit: int = 100) -> list[Domain]:
    """Get all domains with pagination."""
    return db.query(Domain).offset(skip).limit(limit).all()


def update_domain(db: Session, domain_id: int, domain_update: DomainUpdate) -> Domain:
    """Update a domain."""
    db_domain = get_domain(db, domain_id)

    update_data = domain_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_domain, field, value)

    try:
        db.commit()
        db.refresh(db_domain)
        return db_domain
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Domain with name '{domain_update.name}' already exists"
        )


def delete_domain(db: Session, domain_id: int) -> dict:
    """Delete a domain and all its projects and tasks."""
    db_domain = get_domain(db, domain_id)
    domain_name = db_domain.name

    db.delete(db_domain)
    db.commit()

    return {"message": f"Domain '{domain_name}' deleted successfully"}
