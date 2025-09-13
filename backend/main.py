from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import execute, hint, session, health
from api.services.session_service import SessionService
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Mario Coding Game Backend",
    description="FastAPI backend for Mario-style educational coding game",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize session service
session_service = SessionService()

# Include routers
app.include_router(health.router, prefix="", tags=["health"])
app.include_router(execute.router, prefix="/api/v1", tags=["execute"])
app.include_router(hint.router, prefix="/api/v1", tags=["hint"])
app.include_router(session.router, prefix="/api/v1", tags=["session"])

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("Mario Coding Game Backend starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("Mario Coding Game Backend shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)