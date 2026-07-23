from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import auth, vehicles, inventory

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically create database tables if they do not exist
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Warning: Could not connect or initialize database on startup. Error: {e}")
        print("Please ensure PostgreSQL is running and DATABASE_URL is configured correctly.")
    yield

app = FastAPI(
    title="Vehicle Inventory RESTful API",
    description="A robust backend API built with FastAPI, PostgreSQL, and JWT authentication for vehicle inventory management.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(inventory.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "message": "Welcome to Vehicle Inventory RESTful API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "version": "1.0.0"
    }
