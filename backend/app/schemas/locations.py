from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(LocationBase):
    pass


class LocationOut(LocationBase):
    id: int

    class Config:
        orm_mode = True
