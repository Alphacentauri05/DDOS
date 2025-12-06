"""
Analysis router
Handles traffic analysis and statistics
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import io
import csv

from services.analysis_engine import AnalysisEngine

router = APIRouter()

# Initialize analysis engine
analysis_engine = AnalysisEngine()


class AnalysisRequest(BaseModel):
    """Request model for analysis"""
    dataset: List[Dict[str, Any]]


@router.post("/analyze")
async def analyze_dataset(request: AnalysisRequest):
    """
    Analyze dataset and return statistics
    """
    try:
        if not request.dataset:
            raise HTTPException(status_code=400, detail="Dataset is empty")
        
        # Perform analysis
        results = analysis_engine.analyze(request.dataset)
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing dataset: {str(e)}")

