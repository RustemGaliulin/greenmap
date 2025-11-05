from pydantic import BaseModel, EmailStr

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool

    model_config = {"from_attributes": True}
