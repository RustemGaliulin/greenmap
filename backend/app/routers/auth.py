from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, UserCreate, UserLogin
from app.schemas.user import UserOut
from app.core.security import hash_password, verify_password, create_access_token
from app.deps.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="This email is already taken")

    user = User(email=payload.email,
                hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(str(user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserOut.model_validate(user),
    }


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user.id))
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.model_validate(user),
    }


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
