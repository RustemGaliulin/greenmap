from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.locations import router as locations_router
from app.routers.auth import router as auth_router

app = FastAPI(title="GreenMap API")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to GreenMap API"}

app.include_router(auth_router)                        
app.include_router(locations_router, prefix="/locations", tags=["Locations"])
