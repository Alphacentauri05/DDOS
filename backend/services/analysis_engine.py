"""
Analysis Engine Service
Performs statistical analysis on network traffic datasets
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np

class AnalysisEngine:
    """Analyzes network traffic datasets and computes statistics"""
    
    def analyze(self, dataset: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze dataset and return comprehensive statistics
        
        Args:
            dataset: List of traffic records
        
        Returns:
            Dictionary with analysis results
        """
        if not dataset:
            return {}
        
        # Convert to DataFrame
        df = pd.DataFrame(dataset)
        
        # Convert packets_sent to numeric
        df['packets_sent'] = pd.to_numeric(df['packets_sent'], errors='coerce')
        
        # Top talkers (by packets_sent)
        top_talkers = df.groupby('source_node')['packets_sent'].sum().sort_values(ascending=False).head(10)
        top_talkers_list = [
            {"node": node, "packets": int(packets)}
            for node, packets in top_talkers.items()
        ]
        
        # Connection type counts
        connection_counts = df['connection_type'].value_counts().to_dict()
        
        # Identify victim server (highest incoming packets)
        incoming_packets = df.groupby('destination_node')['packets_sent'].sum().sort_values(ascending=False)
        victim_server = incoming_packets.index[0] if len(incoming_packets) > 0 else None
        victim_packets = int(incoming_packets.iloc[0]) if len(incoming_packets) > 0 else 0
        
        # Count bots attacking
        attack_connections = df[df['connection_type'] == 'attack']
        bots_attacking = attack_connections['source_node'].nunique() if len(attack_connections) > 0 else 0
        
        # Packets statistics
        packets_stats = {
            "mean": float(df['packets_sent'].mean()),
            "median": float(df['packets_sent'].median()),
            "std": float(df['packets_sent'].std()),
            "min": int(df['packets_sent'].min()),
            "max": int(df['packets_sent'].max()),
            "total": int(df['packets_sent'].sum())
        }
        
        # Anomaly detection (spike detection)
        mean_packets = df['packets_sent'].mean()
        std_packets = df['packets_sent'].std()
        threshold = mean_packets + (2 * std_packets)  # 2 standard deviations
        anomalies = df[df['packets_sent'] > threshold]
        anomaly_count = len(anomalies)
        
        # Packets histogram data (for chart)
        bins = [0, 50, 100, 500, 1000, 5000, 10000]
        labels = ['0-50', '50-100', '100-500', '500-1000', '1000-5000', '5000+']
        df['packet_range'] = pd.cut(df['packets_sent'], bins=bins, labels=labels, include_lowest=True)
        histogram = df['packet_range'].value_counts().sort_index().to_dict()
        
        # Node type distribution
        def get_node_type(node_name: str) -> str:
            if node_name.startswith('Server_'):
                return 'server'
            elif node_name.startswith('Bot_'):
                return 'bot'
            elif node_name.startswith('User_'):
                return 'user'
            return 'unknown'
        
        df['node_type'] = df['source_node'].apply(get_node_type)
        node_distribution = df['node_type'].value_counts().to_dict()
        
        # Attack indicators
        attack_indicators = {
            "has_attack": len(attack_connections) > 0,
            "attack_connections": len(attack_connections),
            "normal_connections": len(df[df['connection_type'] == 'normal']),
            "attack_packet_ratio": float(len(attack_connections) / len(df)) if len(df) > 0 else 0.0
        }
        
        return {
            "top_talkers": top_talkers_list,
            "connection_counts": connection_counts,
            "victim_server": {
                "node": victim_server,
                "incoming_packets": victim_packets
            },
            "bots_attacking": bots_attacking,
            "packets_statistics": packets_stats,
            "anomaly_detection": {
                "anomaly_count": anomaly_count,
                "threshold": float(threshold),
                "anomalies": [
                    {
                        "source": row['source_node'],
                        "destination": row['destination_node'],
                        "packets": int(row['packets_sent'])
                    }
                    for _, row in anomalies.head(10).iterrows()
                ]
            },
            "packets_histogram": histogram,
            "node_distribution": node_distribution,
            "attack_indicators": attack_indicators,
            "total_connections": len(df),
            "unique_nodes": {
                "sources": df['source_node'].nunique(),
                "destinations": df['destination_node'].nunique()
            }
        }

