"""
Dataset generation router
Handles dataset generation via LLM
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import io
import csv

from services.dataset_generator import DatasetGenerator

router = APIRouter()

# Initialize dataset generator
dataset_generator = DatasetGenerator()


class DatasetRequest(BaseModel):
    """Request model for dataset generation"""
    number_of_servers: int
    number_of_bots: int
    total_nodes: int
    attack_enabled: bool


class DatasetResponse(BaseModel):
    """Response model for dataset generation"""
    dataset: list
    csv_data: str
    message: str


@router.post("/generate-dataset", response_model=DatasetResponse)
async def generate_dataset(request: DatasetRequest):
    """
    Generate synthetic dataset using LLM
    """
    try:
        # Validate inputs
        if request.number_of_servers < 1:
            raise HTTPException(status_code=400, detail="Number of servers must be at least 1")
        if request.number_of_bots < 0:
            raise HTTPException(status_code=400, detail="Number of bots cannot be negative")
        if request.total_nodes < request.number_of_servers + request.number_of_bots:
            raise HTTPException(
                status_code=400,
                detail="Total nodes must be at least servers + bots"
            )
        
        # Generate dataset using LLM
        csv_data = await dataset_generator.generate(
            servers=request.number_of_servers,
            bots=request.number_of_bots,
            total_nodes=request.total_nodes,
            attack_enabled=request.attack_enabled
        )
        
        # Parse CSV to JSON for frontend
        csv_reader = csv.DictReader(io.StringIO(csv_data))
        
        # Normalize column names (handle variations from LLM)
        column_mapping = {
            'destination': 'destination_node',
            'dest': 'destination_node',
            'destination_node': 'destination_node',
            'packets_s': 'packets_sent',
            'packets': 'packets_sent',
            'packets_sent': 'packets_sent',
            'source': 'source_node',
            'source_node': 'source_node',
            'connection': 'connection_type',
            'type': 'connection_type',
            'connection_type': 'connection_type'
        }
        
        dataset = []
        for row in csv_reader:
            # Normalize column names
            normalized_row = {}
            for key, value in row.items():
                # Strip whitespace from keys and values
                clean_key = key.strip().lower()
                clean_value = value.strip() if value else ''
                
                # Map to standard column name
                standard_key = column_mapping.get(clean_key, clean_key)
                normalized_row[standard_key] = clean_value
            
            # Only add rows that have all required fields
            required_fields = ['source_node', 'destination_node', 'packets_sent', 'connection_type']
            if all(field in normalized_row and normalized_row[field] for field in required_fields):
                dataset.append(normalized_row)
        
        if len(dataset) == 0:
            raise HTTPException(
                status_code=500, 
                detail="No valid rows found in generated dataset. Please check the CSV format."
            )
        
        return DatasetResponse(
            dataset=dataset,
            csv_data=csv_data,
            message=f"Dataset generated successfully with {len(dataset)} records"
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the full error for debugging
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating dataset: {str(e)}")
        print(f"Traceback: {error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating dataset: {str(e)}"
        )

