"""
Report Generator Service
Uses LangChain to generate attack explanation reports via LLM
"""

import os
from typing import List, Dict, Any
from collections import Counter
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import io
import csv

class ReportGenerator:
    """Generates attack explanation reports using LLM"""
    
    def __init__(self):
        """Initialize the report generator with LLM"""
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        # Allow selecting a smaller model via env to reduce token usage.
        model_name = os.getenv("REPORT_MODEL", "llama-3.1-8b-instant")
        self.llm = ChatGroq(
            model=model_name,
            temperature=float(os.getenv("REPORT_TEMP", "0.6")),
            api_key=api_key,
        )
    
    async def generate(
        self,
        dataset: List[Dict[str, Any]],
        servers: int,
        bots: int,
        total_nodes: int,
        attack_enabled: bool
    ) -> str:
        """
        Generate attack explanation report using LLM
        
        Args:
            dataset: List of traffic records
            servers: Number of servers
            bots: Number of bots
            total_nodes: Total number of nodes
            attack_enabled: Whether DDoS attack was enabled
        
        Returns:
            Report text
        """
        # Convert dataset to a small sample and summary to reduce token usage
        if not dataset:
            raise ValueError("Dataset is empty")

        num_records = len(dataset)
        total_packets = 0
        dst_counts = Counter()
        sample_size = min(25, num_records)
        sample_rows = dataset[:sample_size]

        for row in dataset:
            pkt = row.get('packets_sent') or row.get('packets') or 0
            try:
                total_packets += int(pkt)
            except Exception:
                try:
                    total_packets += int(float(pkt))
                except Exception:
                    pass
            dst = row.get('destination_node') or row.get('destination') or None
            if dst:
                dst_counts[dst] += 1

        top_dests = dst_counts.most_common(3)
        top_dests_str = ", ".join([f"{d} ({c})" for d, c in top_dests]) if top_dests else "none"

        # Small CSV sample for context (only first N rows)
        sample_output = io.StringIO()
        fieldnames = list({k for r in sample_rows for k in r.keys()})[:8]
        writer = csv.DictWriter(sample_output, fieldnames=fieldnames, extrasaction='ignore')
        try:
            writer.writeheader()
            writer.writerows(sample_rows)
            sample_csv = sample_output.getvalue()
        except Exception:
            sample_csv = ""

        # Build a concise prompt that includes only summary + small sample to save tokens
        prompt = f"""You are a cybersecurity expert. Produce a concise, professional plain text report.

STRUCTURE:
- Title: DDoS ATTACK ANALYSIS REPORT (centered, uppercase)
- Sections: SUMMARY, PARAMETERS, FINDINGS (numbered 1-7), CONCLUSION
- Use simple formatting: section headers in UPPERCASE, bullet points with dashes (-)
- NO Markdown symbols (no #, **, `, etc.)
- Keep it short (6-12 sentences total)

DATA SUMMARY:
- Records: {num_records}
- Total packets (approx): {total_packets}
- Top destinations: {top_dests_str}

SAMPLE (first {sample_size} rows):
{sample_csv}

USER PARAMETERS:
- Servers: {servers}
- Bots: {bots}
- Total Nodes: {total_nodes}
- Attack Enabled: {attack_enabled}

Generate a clean, professional plain text report now."""

        # Call LLM
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            report = response.content.strip()
            return report

        except Exception as e:
            # If rate limit or service error, return a fallback Markdown report instead of failing hard.
            err_str = str(e)
            if 'rate_limit' in err_str.lower() or 'rate limit' in err_str.lower() or '429' in err_str:
                return self._fallback_markdown(dataset, servers, bots, total_nodes, attack_enabled, reason=err_str)

            # Bubble up other exceptions
            raise Exception(f"Error generating report with LLM: {str(e)}")

    def _safe_int(self, value: object, default: int = 0) -> int:
        try:
            return int(value)
        except Exception:
            return default

    def _fallback_markdown(
        self,
        dataset: List[Dict[str, Any]],
        servers: int,
        bots: int,
        total_nodes: int,
        attack_enabled: bool,
        reason: str = "LLM unavailable",
    ) -> str:
        """
        Generate a simple, deterministic Markdown report from the dataset when the LLM is unavailable.
        This provides immediate, useful information and encourages retrying the LLM later.
        """
        # Basic stats
        num_records = len(dataset)
        src_counter = Counter()
        dst_counter = Counter()
        total_packets = 0

        for row in dataset:
            src = row.get('source_node') or row.get('source') or 'unknown'
            dst = row.get('destination_node') or row.get('destination') or 'unknown'
            pkt = row.get('packets_sent') or row.get('packets') or 0
            try:
                pkt_val = int(pkt)
            except Exception:
                try:
                    pkt_val = int(float(pkt))
                except Exception:
                    pkt_val = 0
            src_counter[src] += 1
            dst_counter[dst] += 1
            total_packets += pkt_val

        top_dst, top_dst_count = dst_counter.most_common(1)[0] if dst_counter else ("unknown", 0)
        unique_sources = len(src_counter)

        lines = [
            "=" * 50,
            "       DDoS ATTACK ANALYSIS REPORT",
            "=" * 50,
            "",
            "SUMMARY",
            "-" * 50,
            f"Fallback report generated (LLM unavailable: {reason[:50]}...)",
            "",
            "PARAMETERS",
            "-" * 50,
            f"- Servers: {servers}",
            f"- Bots: {bots}",
            f"- Total Nodes: {total_nodes}",
            f"- Attack Enabled: {attack_enabled}",
            "",
            "FINDINGS",
            "-" * 50,
            "",
            "1. What is a DDoS attack?",
            "   A Distributed Denial of Service (DDoS) attack is when many clients",
            "   (bots) send excessive traffic to a target server to overwhelm its capacity.",
            "",
            "2. How parameters shaped the dataset",
            f"   The dataset contains {num_records} records with {servers} servers,",
            f"   {bots} bots, and {total_nodes} total nodes.",
            "",
            "3. Suspected victim server",
            f"   Most-contacted destination: {top_dst} ({top_dst_count} records)",
            "",
            "4. Bot participation",
            f"   Detected {unique_sources} unique source nodes; configured bots: {bots}",
            "",
            "5. Traffic pattern evidence",
            "   - High concentration of records targeting a single destination",
            f"   - Total packets observed: {total_packets}",
            "   - Many unique sources hitting the same destination",
            "",
            "6. Graph interpretation",
            "   The graph shows many sources connecting to a central node, indicating",
            "   attack origin groups and normal traffic patterns.",
            "",
            "7. Key indicators",
            "   - Single destination with many incoming connections",
            "   - Large packet counts on suspected victim",
            "   - High ratio of sources-to-destinations",
            "",
            "CONCLUSION",
            "-" * 50,
            "This fallback report provides immediate indicators from the dataset.",
            "Retry when LLM is available for richer analysis.",
            "",
            "=" * 50,
        ]

        return "\n".join(lines)

