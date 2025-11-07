from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.location import Location
from app.deps.auth import get_current_user
from app.schemas.locations import LocationCreate, LocationUpdate, LocationOut
from app.models.user import User

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/", response_model=list[LocationOut])
def get_locations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Location).filter(Location.owner_id == current_user.id).all()


@router.post("/", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def create_location(
    payload: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_location = Location(**payload.model_dump(), owner_id=current_user.id)
    db.add(new_location)
    db.commit()
    db.refresh(new_location)
    return new_location


@router.put("/{location_id}", response_model=LocationOut)
def update_location(
    location_id: int,
    payload: LocationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = db.query(Location).filter(Location.id == location_id, Location.owner_id == current_user.id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(location, key, value)
    db.commit()
    db.refresh(location)
    return location


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = db.query(Location).filter(Location.id == location_id, Location.owner_id == current_user.id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(location)
    db.commit()
    return
