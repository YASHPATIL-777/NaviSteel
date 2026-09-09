import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import ColoadRequest, ColoadResponse, ColoadOpportunity
except ImportError:
    from models.schemas import ColoadRequest, ColoadResponse, ColoadOpportunity

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_coload_opportunities() -> List[Dict[str, Any]]:
    with open(DATA_DIR / "coloading_opportunities.json", "r", encoding="utf-8") as f:
        return json.load(f)

def match_coloading_opportunities(req: ColoadRequest) -> ColoadResponse:
    opps_raw = load_coload_opportunities()
    
    opportunities: List[ColoadOpportunity] = []
    
    for item in opps_raw:
        origin_match = any(w.lower() in item["origin"].lower() for w in req.origin.split())
        dest_match = any(w.lower() in item["discharge_port"].lower() for w in req.destination.split())
        
        score = item["match_score"]
        if origin_match and dest_match:
            score = min(98, score + 4)
        elif not origin_match and not dest_match:
            score = max(50, score - 20)
            
        opportunities.append(ColoadOpportunity(
            id=item["id"],
            partner=item["partner"],
            psu_type=item["psu_type"],
            origin=item["origin"],
            discharge_port=item["discharge_port"],
            cargo_type=item["cargo_type"],
            cargo_available_mt=item["cargo_available_mt"],
            vessel_class=item["vessel_class"],
            laycan_window=item["laycan_window"],
            status=item["status"],
            match_score=score,
            synergistic_savings_usd=float(item["synergistic_savings_usd"]),
            co2_reduction_mt=float(item["co2_reduction_mt"]),
            route_deviation_nm=int(item["route_deviation_nm"]),
            notes=item["notes"]
        ))
        
    opportunities.sort(key=lambda x: x.match_score, reverse=True)
    best_match = opportunities[0] if opportunities else None
    
    return ColoadResponse(
        best_match=best_match,
        opportunities=opportunities,
        total_opportunities=len(opportunities),
        disclaimer="Prototype / Simulated Coordination Dataset"
    )
