import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import RiskMatrixRequest, RiskMatrixResponse, MonthlyRiskItem
except ImportError:
    from models.schemas import RiskMatrixRequest, RiskMatrixResponse, MonthlyRiskItem

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_seasonal_risk() -> Dict[str, Any]:
    with open(DATA_DIR / "seasonal_risk.json", "r", encoding="utf-8") as f:
        return json.load(f)

def calculate_monthly_risk_matrix(req: RiskMatrixRequest) -> RiskMatrixResponse:
    risk_data = load_seasonal_risk()
    monthly_factors = risk_data.get("monthly_factors", {})
    
    months: List[MonthlyRiskItem] = []
    
    actions_map = {
        1: "Fair Weather Optimal // Standard COA Execution",
        2: "Lowest Swell Risk // Priority Long-Haul Discharge",
        3: "Favorable Window // Accelerate Plant Inventory Build",
        4: "Pre-Monsoon Window // Conclude Long-Term Charter Contracts",
        5: "Pre-Monsoon Precaution // Buffer Stockpile Deployment",
        6: "High Swell Surge // Shift to Geographically Protected Berths",
        7: "Peak Monsoon Disruption // Minimize Spot Charter Commitments",
        8: "Heavy Swell & Siltation // Require High Under-Keel Clearance",
        9: "Monsoon Retreat // Optimal Window for Restocking Laycans",
        10: "Post-Monsoon Cyclone Watch // Prioritize Fast Discharge Rigs",
        11: "Cyclonic Depression Zone // Maintain 48h Weather Route Vigil",
        12: "Winter Window Optimal // Maximize Vessel Utilization & Evacuation"
    }
    
    draft_risk_map = {
        1: "Minimal Siltation (Normal UKC)",
        2: "Minimal Siltation (Normal UKC)",
        3: "Low Siltation (Normal UKC)",
        4: "Moderate Tidal Shift",
        5: "Pre-Monsoon Swell Lift",
        6: "High Monsoon Siltation (1.2m UKC Buffer Req)",
        7: "Severe Siltation & High Swell (1.5m UKC Req)",
        8: "High Siltation & Swell (1.3m UKC Req)",
        9: "Receding Swell (0.8m UKC Buffer)",
        10: "Cyclonic Wave Surge Risk",
        11: "Depression Wave Surges",
        12: "Stable Bathymetry (Normal UKC)"
    }
    
    for m_str, m_val in monthly_factors.items():
        m_num = int(m_str)
        m_name = m_val["name"]
        monsoon = m_val["monsoon"]
        cyclone = m_val["cyclone"]
        rake_shortage = m_val["rake_shortage"]
        delay = m_val["historical_congestion_days"]
        
        score = int(round((monsoon * 45) + (cyclone * 25) + (rake_shortage * 15) + (min(delay / 6.0, 1.0) * 15)))
        
        if score >= 70:
            level = "CRITICAL"
        elif score >= 50:
            level = "ELEVATED"
        elif score >= 30:
            level = "MODERATE"
        else:
            level = "LOW"
            
        demurrage_exposure = round(delay * 22000.0, 2)
        rake_avail = int(round((1.0 - rake_shortage) * 100))
        
        months.append(MonthlyRiskItem(
            month_num=m_num,
            month_name=m_name,
            risk_score=score,
            monsoon_factor=monsoon,
            cyclone_factor=cyclone,
            congestion_factor=round(min(delay / 6.0, 1.0), 2),
            demurrage_exposure_usd=demurrage_exposure,
            delay_days=delay,
            draft_risk=draft_risk_map.get(m_num, "Normal"),
            rake_availability_pct=rake_avail,
            recommended_action=actions_map.get(m_num, "Standard Execution"),
            risk_level=level
        ))
        
    months.sort(key=lambda x: x.month_num)
    
    highest = max(months, key=lambda x: x.risk_score).month_name
    lowest = min(months, key=lambda x: x.risk_score).month_name
    
    return RiskMatrixResponse(
        months=months,
        highest_risk_month=highest,
        lowest_risk_month=lowest,
        disclaimer="Simulated 12-Month Multi-Factor Risk Assessment"
    )
