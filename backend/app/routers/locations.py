from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationOut
from app.deps.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[LocationOut])
def list_locations(db: Session = Depends(get_db)):
    return db.query(Location).filter(Location.status == "approved").order_by(Location.id.desc()).all()

@router.post("/", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def create_location(
    payload: LocationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    loc = Location(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        status="approved",
        created_by=user.id,
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc
