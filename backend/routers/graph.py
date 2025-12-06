"""
Graph visualization router
Handles network graph generation
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import os

from services.graph_builder import GraphBuilder

router = APIRouter()

# Initialize graph builder
graph_builder = GraphBuilder()


class GraphRequest(BaseModel):
    """Request model for graph generation"""
    dataset: List[Dict[str, Any]]


@router.post("/graph")
async def generate_graph(request: GraphRequest):
    """
    Generate network graph HTML file
    """
    try:
        if not request.dataset:
            raise HTTPException(status_code=400, detail="Dataset is empty")
        
        # Generate graph
        graph_path = await graph_builder.build_graph(request.dataset)
        
        if not os.path.exists(graph_path):
            raise HTTPException(status_code=500, detail="Graph file not generated")
        
        return FileResponse(
            graph_path,
            media_type="text/html",
            filename="graph.html"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating graph: {str(e)}")


@router.get("/graph/static")
async def get_graph_static():
    """
    Serve the generated graph HTML file
    """
    graph_path = "static/graph.html"
    if not os.path.exists(graph_path):
        raise HTTPException(status_code=404, detail="Graph not found. Please generate it first.")
    
    return FileResponse(
        graph_path,
        media_type="text/html",
        filename="graph.html"
    )

