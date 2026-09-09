import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import AlertsRequest, AlertsResponse, DisruptionAlert
except ImportError:
    from models.schemas import AlertsRequest, AlertsResponse, DisruptionAlert

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_alert_data() -> Dict[str, Any]:
    path = DATA_DIR / "alert_thresholds.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def evaluate_disruption_alerts(req: AlertsRequest) -> AlertsResponse:
    alert_data = load_alert_data()
    weights = alert_data.get("score_weights", {
        "freight_volatility": 0.25,
        "port_congestion": 0.25,
        "monsoon_swell": 0.20,
        "demurrage_exposure": 0.15,
        "logistics_rake": 0.15
    })
    
    month = req.month_num if req.month_num else 9
    
    # Compute component risk scores (0-100) based on season and port
    s_freight = 82.0 if month in [8, 9, 10, 11] else 45.0
    s_congestion = 76.0 if req.destination in ["Paradip", "Visakhapatnam"] else 40.0
    s_monsoon = 68.0 if month in [6, 7, 8, 9] else 25.0
    s_demurrage = 74.0 if req.destination in ["Paradip", "Visakhapatnam"] else 35.0
    s_rake = 60.0 if req.destination in ["Paradip", "Haldia"] else 30.0
    
    composite_score = int(round(
        (weights.get("freight_volatility", 0.25) * s_freight) +
        (weights.get("port_congestion", 0.25) * s_congestion) +
        (weights.get("monsoon_swell", 0.20) * s_monsoon) +
        (weights.get("demurrage_exposure", 0.15) * s_demurrage) +
        (weights.get("logistics_rake", 0.15) * s_rake)
    ))
    
    if composite_score >= 80:
        risk_level = "CRITICAL"
    elif composite_score >= 60:
        risk_level = "HIGH"
    elif composite_score >= 30:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"
        
    score_breakdown = {
        "Freight Rate Volatility (25%)": s_freight,
        "Berth Port Congestion (25%)": s_congestion,
        "Monsoon Swell & Wave Surge (20%)": s_monsoon,
        "Demurrage Exposure (15%)": s_demurrage,
        "Railway Rake Logistics (15%)": s_rake
    }
    
    alerts: List[DisruptionAlert] = [
        DisruptionAlert(
            alert_type="PORT_CONGESTION",
            title="Post-Monsoon Berth Congestion Advisory",
            severity="HIGH",
            port=req.destination,
            route=f"{req.origin} ➔ {req.destination}",
            probability_pct=78,
            expected_delay_days=4.1,
            estimated_exposure_usd=116000.0,
            recommended_action="BOOK VESSEL BEFORE CONGESTION PEAK OR DIVERT 30% VOLUME TO DHAMRA",
            source_type="AIS Port Radar & Terminal Queue Model"
        ),
        DisruptionAlert(
            alert_type="FREIGHT_VOLATILITY",
            title="Q4 Forward Freight Rate Surge Warning",
            severity="HIGH",
            port=req.destination,
            route=f"{req.origin} ➔ {req.destination}",
            probability_pct=85,
            expected_delay_days=0.0,
            estimated_exposure_usd=260000.0,
            recommended_action="LOCK SHORT-TERM MULTIPLE VOYAGE COA BEFORE 30-DAY WINDOW EXPIRES",
            source_type="Econometric Forward Freight Curve"
        ),
        DisruptionAlert(
            alert_type="MONSOON_SWELL",
            title="Bay of Bengal Swell & Under-Keel Clearance Advisory",
            severity="MODERATE",
            port=req.destination,
            route=f"{req.origin} ➔ {req.destination}",
            probability_pct=72,
            expected_delay_days=2.5,
            estimated_exposure_usd=55000.0,
            recommended_action="ENSURE MINIMUM 1.2M UKC OR SCHEDULE DEEP WATER DISCHARGE",
            source_type="Open-Meteo Hydrodynamic Telemetry"
        ),
        DisruptionAlert(
            alert_type="RAIL_LOGISTICS",
            title="ECoR / SER Freight Rake Allocation Deficit",
            severity="MODERATE",
            port=req.destination,
            route=f"{req.origin} ➔ {req.destination}",
            probability_pct=65,
            expected_delay_days=3.0,
            estimated_exposure_usd=48000.0,
            recommended_action="ACTIVATE CONTINGENCY RAKE INDENT VIA DEDICATED RAIL CORRIDOR",
            source_type="FOIS Indian Railways Telemetry"
        )
    ]
    
    top_alert = alerts[0] if alerts else None
    
    return AlertsResponse(
        composite_risk_score=composite_score,
        risk_level=risk_level,
        score_breakdown=score_breakdown,
        active_alerts_count=len(alerts),
        top_alert=top_alert,
        alerts=alerts,
        disclaimer="Prototype Multi-Factor Early Warning System"
    )
