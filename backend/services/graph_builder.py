"""
Graph Builder Service
Creates network visualization using NetworkX and PyVis
"""

import networkx as nx
from pyvis.network import Network
from typing import List, Dict, Any
import os

class GraphBuilder:
    """Builds network graphs for visualization"""
    
    def __init__(self):
        """Initialize graph builder"""
        self.output_dir = "static"
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def build_graph(self, dataset: List[Dict[str, Any]]) -> str:
        """
        Build network graph from dataset
        
        Args:
            dataset: List of traffic records
        
        Returns:
            Path to generated HTML file
        """
        # Create NetworkX graph
        G = nx.DiGraph()
        
        # Add edges with weights
        for record in dataset:
            source = record['source_node']
            destination = record['destination_node']
            packets = int(record['packets_sent'])
            connection_type = record.get('connection_type', 'normal')
            
            # Add edge with weight
            if G.has_edge(source, destination):
                G[source][destination]['weight'] += packets
            else:
                G.add_edge(source, destination, weight=packets, connection_type=connection_type)
        
        # Create PyVis network
        net = Network(
            height="800px",
            width="100%",
            directed=True,
            bgcolor="#222222",
            font_color="white"
        )
        
        # Add nodes with colors based on type
        all_nodes = set()
        for record in dataset:
            all_nodes.add(record['source_node'])
            all_nodes.add(record['destination_node'])
        
        for node in all_nodes:
            node_type = self._get_node_type(node)
            color = self._get_node_color(node_type)
            
            net.add_node(
                node,
                label=node,
                color=color,
                size=30,
                font={"size": 14, "color": "white"}
            )
        
        # Add edges with thickness based on packets
        for source, destination, data in G.edges(data=True):
            weight = data.get('weight', 1)
            connection_type = data.get('connection_type', 'normal')
            
            # Scale edge width (normalize to 1-10 range)
            max_weight = max([d.get('weight', 1) for _, _, d in G.edges(data=True)], default=1)
            edge_width = max(1, min(10, (weight / max_weight) * 10))
            
            # Color edges: red for attack, gray for normal
            edge_color = "#ff0000" if connection_type == "attack" else "#888888"
            
            net.add_edge(
                source,
                destination,
                value=weight,
                width=edge_width,
                color=edge_color,
                title=f"{source} → {destination}: {weight} packets"
            )
        
        # Configure physics
        net.set_options("""
        {
          "physics": {
            "enabled": true,
            "stabilization": {"enabled": true, "iterations": 200},
            "barnesHut": {
              "gravitationalConstant": -2000,
              "centralGravity": 0.1,
              "springLength": 200,
              "springConstant": 0.04
            }
          }
        }
        """)
        
        # Save graph
        output_path = os.path.join(self.output_dir, "graph.html")
        net.save_graph(output_path)
        
        return output_path
    
    def _get_node_type(self, node_name: str) -> str:
        """Determine node type from name"""
        if node_name.startswith('Server_'):
            return 'server'
        elif node_name.startswith('Bot_'):
            return 'bot'
        elif node_name.startswith('User_'):
            return 'user'
        return 'unknown'
    
    def _get_node_color(self, node_type: str) -> str:
        """Get color for node type"""
        color_map = {
            'server': '#3b82f6',  # Blue
            'bot': '#ef4444',     # Red
            'user': '#10b981',    # Green
            'unknown': '#6b7280'  # Gray
        }
        return color_map.get(node_type, '#6b7280')

