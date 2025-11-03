from pydantic import BaseModel, Field
from typing import Optional

class LocationCreate(BaseModel):
    title: str = Field(..., max_length=120)
    description: Optional[str] = Field(None, max_length=1024)
    category: str = Field(..., max_length=50)
    latitude: float
    longitude: float

class LocationOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    latitude: float
    longitude: float
    status: str

    class Config:
        orm_mode = True
