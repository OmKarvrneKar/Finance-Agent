from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
from app.routers import transactions, agent

# Initialize tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Finance Agent API",
    description="Backend for AI Finance Agent statement ingestion and categorization",
    version="1.0.0"
)

import os

# CORS setup
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    os.getenv("FRONTEND_URL", "")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(transactions.router, prefix="/api", tags=["transactions"])
app.include_router(agent.router, prefix="/api", tags=["agent"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Finance Agent API. Go to /docs for API documentation."}
