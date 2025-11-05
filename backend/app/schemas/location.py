from pydantic import BaseModel

class LocationBase(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float

class LocationCreate(LocationBase):
    pass

class LocationOut(LocationBase):
    id: int
    owner_id: int

    model_config = {"from_attributes": True}