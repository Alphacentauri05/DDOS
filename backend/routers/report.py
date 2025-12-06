"""
Report generation router
Handles LLM-based attack explanation reports
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from services.report_generator import ReportGenerator

router = APIRouter()

# Initialize report generator
report_generator = ReportGenerator()


class ReportRequest(BaseModel):
    """Request model for report generation"""
    dataset: List[Dict[str, Any]]
    number_of_servers: int
    number_of_bots: int
    total_nodes: int
    attack_enabled: bool


class ReportResponse(BaseModel):
    """Response model for report generation"""
    report: str
    message: str


@router.post("/explain-attack", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    """
    Generate attack explanation report using LLM
    """
    try:
        if not request.dataset:
            raise HTTPException(status_code=400, detail="Dataset is empty")
        
        # Generate report
        report = await report_generator.generate(
            dataset=request.dataset,
            servers=request.number_of_servers,
            bots=request.number_of_bots,
            total_nodes=request.total_nodes,
            attack_enabled=request.attack_enabled
        )
        
        return ReportResponse(
            report=report,
            message="Report generated successfully"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

