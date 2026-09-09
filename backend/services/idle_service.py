import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import IdleStrategyRequest, IdleStrategyResponse, IdleAlternative
except ImportError:
    from models.schemas import IdleStrategyRequest, IdleStrategyResponse, IdleAlternative

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_idle_opportunities() -> List[Dict[str, Any]]:
    path = DATA_DIR / "idle_opportunities.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_vessel_daily_cost(vessel_type: str) -> float:
    v = vessel_type.lower()
    if "cape" in v:
        return 28000.0
    elif "supra" in v:
        return 17500.0
    elif "handy" in v:
        return 14000.0
    return 21000.0 # Panamax default

def evaluate_idle_strategy(req: IdleStrategyRequest) -> IdleStrategyResponse:
    daily_cost = req.daily_vessel_cost if req.daily_vessel_cost else get_vessel_daily_cost(req.vessel_type)
    baseline_idle_days = 4.8
    baseline_loss = round(baseline_idle_days * daily_cost, 2)
    
    raw_alts = load_idle_opportunities()
    alternatives: List[IdleAlternative] = []
    
    for item in raw_alts:
        savings = float(item["financial_impact_usd"])
        if "cape" in req.vessel_type.lower() and savings > 0:
            savings = round(savings * 1.25, 2)
            
        alternatives.append(IdleAlternative(
            id=item["id"],
            strategy_type=item["strategy_type"],
            title=item["title"],
            description=item["description"],
            route=item["route"],
            cargo=item["cargo"],
            expected_idle_days=float(item["expected_idle_days"]),
            idle_reduction_days=float(item["idle_reduction_days"]),
            financial_impact_usd=savings,
            financial_type=item["financial_type"],
            deadheading_risk=item["deadheading_risk"],
            recommendation_rank=int(item["recommendation_rank"]),
            action_label=item["action_label"]
        ))
        
    alternatives.sort(key=lambda x: x.recommendation_rank)
    best_alt = alternatives[0] if alternatives else None
    
    rec_strat = "ACCEPT CO-LOAD & REPOSITION"
    rec_action = best_alt.action_label if best_alt else "MERGE DISCHARGE SCHEDULES"
    potential_savings = best_alt.financial_impact_usd if best_alt else 108000.0
    
    return IdleStrategyResponse(
        baseline_idle_days=baseline_idle_days,
        daily_vessel_cost_usd=daily_cost,
        baseline_idle_loss_usd=baseline_loss,
        recommended_strategy=rec_strat,
        recommended_action=rec_action,
        potential_savings_usd=potential_savings,
        alternatives=alternatives,
        disclaimer="Simulated Vessel Positioning & Idle Optimization"
    )
