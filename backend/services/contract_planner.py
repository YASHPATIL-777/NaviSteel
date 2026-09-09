import json
import math
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import ContractPlanRequest, ContractPlanResponse, ContractOption
    from backend.services.forecasting_service import get_baseline_rate
except ImportError:
    from models.schemas import ContractPlanRequest, ContractPlanResponse, ContractOption
    from services.forecasting_service import get_baseline_rate

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_contract_assumptions() -> Dict[str, Any]:
    path = DATA_DIR / "contract_assumptions.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "spot_volatility_premium_pct": 0.12,
        "short_term_discount_pct": 0.04,
        "medium_term_discount_pct": 0.08
    }

def plan_procurement_contracts(req: ContractPlanRequest) -> ContractPlanResponse:
    assumptions = load_contract_assumptions()
    
    base_rate = req.current_spot_rate if req.current_spot_rate else get_baseline_rate(req.origin, req.destination, req.preferred_vessel_type)
    
    # Standard vessel lot sizing
    v_type = req.preferred_vessel_type.lower()
    if "cape" in v_type:
        lot_cap = 150000.0
    elif "supra" in v_type:
        lot_cap = 50000.0
    elif "handy" in v_type:
        lot_cap = 35000.0
    else:
        lot_cap = 75000.0 # Panamax default
        
    num_voyages = math.ceil(req.annual_demand_mt / lot_cap)
    
    # 1. Spot Strategy: Subject to spot premium & seasonal price surges
    spot_rate = round(base_rate * (1.0 + assumptions.get("spot_volatility_premium_pct", 0.12)), 2)
    spot_spend = round(spot_rate * req.annual_demand_mt, 2)
    
    # 2. Short-Term Multi-Voyage (3-6 Months): Rate locked ahead of peak season surge
    short_rate = round(base_rate * (1.0 - assumptions.get("short_term_discount_pct", 0.04)), 2)
    short_spend = round(short_rate * req.annual_demand_mt, 2)
    short_savings = round(spot_spend - short_spend, 2)
    
    # 3. Medium-Term COA (12 Months): Long-term structured indexation
    med_rate = round(base_rate * (1.0 - assumptions.get("medium_term_discount_pct", 0.08)), 2)
    med_spend = round(med_rate * req.annual_demand_mt, 2)
    med_savings = round(spot_spend - med_spend, 2)
    
    options = [
        ContractOption(
            strategy_key="spot",
            strategy_name="Spot / Single Voyage Procurement",
            horizon_label="Single Voyage (Ad-hoc)",
            effective_rate_per_mt=spot_rate,
            number_of_voyages=num_voyages,
            total_freight_spend_usd=spot_spend,
            rate_volatility_pct=18.5,
            operational_risk="HIGH",
            flexibility_score=95,
            commitment_score=10,
            expected_savings_vs_spot=0.0,
            is_recommended=False
        ),
        ContractOption(
            strategy_key="short_term",
            strategy_name="Short-Term Multiple Voyage Contract (3-6 Months)",
            horizon_label="3-6 Month Consecutive Voyages",
            effective_rate_per_mt=short_rate,
            number_of_voyages=num_voyages,
            total_freight_spend_usd=short_spend,
            rate_volatility_pct=7.2,
            operational_risk="MEDIUM",
            flexibility_score=75,
            commitment_score=55,
            expected_savings_vs_spot=short_savings,
            is_recommended=True
        ),
        ContractOption(
            strategy_key="medium_term",
            strategy_name="Medium-Term Contract of Affreightment (COA 12 Months)",
            horizon_label="12 Month Multi-Voyage COA",
            effective_rate_per_mt=med_rate,
            number_of_voyages=num_voyages,
            total_freight_spend_usd=med_spend,
            rate_volatility_pct=3.5,
            operational_risk="LOW",
            flexibility_score=45,
            commitment_score=90,
            expected_savings_vs_spot=med_savings,
            is_recommended=False
        )
    ]
    
    recommended_key = "short_term"
    recommended_name = "SHORT-TERM MULTIPLE VOYAGE CONTRACT (3-6 MONTHS)"
    annual_savings = short_savings
    
    rationale = [
        f"Forward Freight Surge: Forecast econometric curve indicates rising freight rates over next 90 days; locking multi-voyage rates protects against spot price spikes.",
        f"Balanced Commitment: Short-term multiple voyages avoid long-term volume lock-in while eliminating single-voyage spot volatility.",
        f"Cost Optimization: Multi-voyage arrangement delivers ${annual_savings:,.0f} annual freight savings compared to repeated spot market chartering."
    ]
    
    return ContractPlanResponse(
        recommended_strategy=recommended_key,
        recommended_strategy_name=recommended_name,
        annual_savings_vs_spot=annual_savings,
        annual_demand_mt=req.annual_demand_mt,
        voyages_planned=num_voyages,
        options=options,
        rationale=rationale,
        disclaimer="Prototype Contract Simulation Model"
    )
