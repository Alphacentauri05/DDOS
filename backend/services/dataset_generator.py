"""
Dataset Generator Service
Uses LangChain to generate synthetic network traffic datasets via LLM
"""

import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import io
import csv

class DatasetGenerator:
    """Generates synthetic network traffic datasets using LLM"""
    
    def __init__(self):
        """Initialize the dataset generator with LLM"""
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        # Allow selecting a smaller model via env to reduce token usage
        model_name = os.getenv("DATASET_MODEL", "llama-3.3-70b-versatile")
        self.llm = ChatGroq(
            model=model_name,
            temperature=float(os.getenv("DATASET_TEMP", "0.7")),
            api_key=api_key,
        )
    
    async def generate(
        self,
        servers: int,
        bots: int,
        total_nodes: int,
        attack_enabled: bool
    ) -> str:
        """
        Generate CSV dataset using LLM
        
        Args:
            servers: Number of servers
            bots: Number of bots
            total_nodes: Total number of nodes
            attack_enabled: Whether DDoS attack is enabled
        
        Returns:
            CSV string with dataset
        """
        # Calculate normal users
        normal_users = total_nodes - servers - bots
        
        if normal_users < 0:
            raise ValueError("Total nodes must be at least servers + bots")
        
        # Build prompt
        prompt_template = """You are a dataset generator that creates a clear, structured synthetic dataset 
for simulating DDoS network traffic.

Generate a dataset strictly in CSV format with the following columns:
source_node, destination_node, packets_sent, connection_type

## USER INPUTS:
- number_of_servers = {servers}
- number_of_bots = {bots}
- total_nodes = {total_nodes}
- attack_enabled = {attack_enabled}

## RULES FOR GENERATION:

1. Node Naming:
   - Servers: Server_1, Server_2, ...
   - Bots: Bot_1, Bot_2, ...
   - Normal users: User_1, User_2, ...

2. Ensure total_nodes = servers + bots + normal_users.

3. CRITICAL RULE - Source/Destination Logic:
   - Servers must NEVER appear as source_node.
   - Servers must ONLY appear as destination_node.
   - Bots and Users are ALWAYS the source_node.
   - This means: source_node can ONLY be Bot_X or User_X, NEVER Server_X.
   - This means: destination_node can ONLY be Server_X, NEVER Bot_X or User_X.

4. Traffic Rules:
   - Normal users: packets_sent = 5–50
   - Bots during attack: packets_sent = 1000–8000
   - If attack_enabled="no", bots behave like normal users.

5. Destination Logic:
   - Normal users → randomly choose any server as destination.
   - Bots in attack mode → all target a single server chosen as the victim.
   - If attack_enabled="no", bots choose servers randomly as destination.

6. connection_type:
   - "attack" only for bots when attack_enabled="yes"
   - Otherwise "normal"

7. Output Format:
   - ONLY CSV TEXT
   - First row must be:
     source_node, destination_node, packets_sent, connection_type
   - No explanation or markdown

8. Dataset Size:
   - At least 3 connections per node

9. VALIDATION CHECK:
   - Every source_node must start with "Bot_" or "User_"
   - Every destination_node must start with "Server_"
   - NO Server_X should ever appear in the source_node column
   - NO Bot_X or User_X should ever appear in the destination_node column

Generate the dataset now."""
        
        prompt = prompt_template.format(
            servers=servers,
            bots=bots,
            total_nodes=total_nodes,
            attack_enabled="yes" if attack_enabled else "no"
        )
        
        # Call LLM
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            csv_data = response.content.strip()
            
            # Clean up response (remove markdown code blocks if present)
            if csv_data.startswith("```"):
                lines = csv_data.split("\n")
                csv_data = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            
            # Clean up any leading/trailing whitespace
            csv_data = csv_data.strip()
            
            # Ensure proper line endings
            csv_data = csv_data.replace('\r\n', '\n').replace('\r', '\n')
            
            # Validate CSV format (with better error messages)
            # try:
            #     self._validate_csv(csv_data)
            # except ValueError as e:
            #     # Log the CSV data for debugging
            #     print(f"CSV Validation Error: {str(e)}")
            #     print(f"First 500 chars of CSV:\n{csv_data[:500]}")
            #     raise Exception(f"Generated CSV failed validation: {str(e)}")
            
            return csv_data
        
        except Exception as e:
            raise Exception(f"Error generating dataset with LLM: {str(e)}")
    
    def _validate_csv(self, csv_data: str):
        """Validate that the CSV data is properly formatted"""
        try:
            reader = csv.DictReader(io.StringIO(csv_data))
            required_columns = {"source_node", "destination_node", "packets_sent", "connection_type"}
            
            if not reader.fieldnames:
                raise ValueError("CSV has no headers")
            
            if not required_columns.issubset(set(reader.fieldnames)):
                raise ValueError(f"CSV missing required columns. Found: {reader.fieldnames}")
            
            rows = list(reader)
            if len(rows) == 0:
                raise ValueError("CSV has no data rows")
            
            # CRITICAL VALIDATION: Enforce source/destination rules
            for idx, row in enumerate(rows, start=2):  # Start at 2 because row 1 is header
                source = row.get('source_node', '').strip()
                destination = row.get('destination_node', '').strip()
                
                # Servers must NEVER appear as source_node
                if source.startswith('Server_'):
                    raise ValueError(
                        f"Row {idx}: CRITICAL ERROR - Server '{source}' appears as source_node. "
                        f"Servers must NEVER be source nodes. Only Bots and Users can be source nodes."
                    )
                
                # Bots and Users must NEVER appear as destination_node
                if destination.startswith('Bot_') or destination.startswith('User_'):
                    raise ValueError(
                        f"Row {idx}: CRITICAL ERROR - '{destination}' appears as destination_node. "
                        f"Only Servers can be destination nodes. Bots and Users must be source nodes only."
                    )
                
                # Servers must ONLY appear as destination_node
                if not destination.startswith('Server_'):
                    raise ValueError(
                        f"Row {idx}: CRITICAL ERROR - Destination '{destination}' is not a Server. "
                        f"All destination nodes must be Servers (Server_1, Server_2, etc.)."
                    )
        
        except ValueError:
            # Re-raise ValueError as-is (these are our validation errors)
            raise
        except Exception as e:
            raise ValueError(f"Invalid CSV format: {str(e)}")

