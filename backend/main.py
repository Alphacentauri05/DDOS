"""
FastAPI Backend for DDoS Attack Simulation and SNA Visualizer
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from routers import dataset, analysis, graph, report

app = FastAPI(
    title="DDoS Attack Simulation API",
    description="Backend API for DDoS attack simulation and network analysis",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001","http://localhost:3002","http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for graph HTML
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(dataset.router, prefix="/api", tags=["dataset"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(graph.router, prefix="/api", tags=["graph"])
app.include_router(report.router, prefix="/api", tags=["report"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "DDoS Attack Simulation API", "status": "running"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

