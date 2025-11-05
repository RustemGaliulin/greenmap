from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationOut
from app.deps.auth import get_current_user

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.post("/", response_model=LocationOut)
def create_location(payload: LocationCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    loc = Location(**payload.model_dump(), owner_id=user.id)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc

@router.get("/", response_model=list[LocationOut])
def get_locations(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Location).filter(Location.owner_id == user.id).all()
