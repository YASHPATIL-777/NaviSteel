import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import SafetyCheckRequest, SafetyCheckResponse, AlternatePort
except ImportError:
    from models.schemas import SafetyCheckRequest, SafetyCheckResponse, AlternatePort

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_ports() -> Dict[str, Any]:
    with open(DATA_DIR / "ports.json", "r", encoding="utf-8") as f:
        return json.load(f)

def evaluate_safety_gate(req: SafetyCheckRequest) -> SafetyCheckResponse:
    ports = load_ports()
    dest = req.destination
    port = ports.get(dest, ports.get("Paradip"))
    
    port_max_draft = float(port.get("max_draft", 16.0))
    port_max_loa = float(port.get("max_loa", 280.0))
    wave_limit = float(port.get("wave_limit", 2.5))
    wind_limit = float(port.get("wind_limit", 40.0))
    
    wave_height = req.wave_height if req.wave_height is not None else 1.4
    wind_speed = req.wind_speed if req.wind_speed is not None else 24.8
    
    draft_margin = round(port_max_draft - req.vessel_draft, 2)
    loa_margin = round(port_max_loa - req.vessel_loa, 1)
    
    wave_safe = wave_height <= wave_limit
    wind_safe = wind_speed <= wind_limit
    weather_safe = wave_safe and wind_safe
    
    reasons: List[str] = []
    alternate_ports: List[AlternatePort] = []
    
    is_draft_ok = req.vessel_draft <= port_max_draft
    is_loa_ok = req.vessel_loa <= port_max_loa
    
    if not is_draft_ok:
        diff = round(req.vessel_draft - port_max_draft, 2)
        reasons.append(f"Vessel Draft ({req.vessel_draft}m) exceeds {port.get('name')} max permissible draft ({port_max_draft}m) by {diff}m.")
    
    if not is_loa_ok:
        diff_loa = round(req.vessel_loa - port_max_loa, 1)
        reasons.append(f"Vessel LOA ({req.vessel_loa}m) exceeds {port.get('name')} max berth LOA ({port_max_loa}m) by {diff_loa}m.")
        
    if not wave_safe:
        reasons.append(f"Significant wave height ({wave_height}m) exceeds safe pilotage limit ({wave_limit}m).")
        
    if not wind_safe:
        reasons.append(f"Wind speed ({wind_speed} km/h) exceeds safe crane/unloader operation limit ({wind_limit} km/h).")
        
    approved = is_draft_ok and is_loa_ok and weather_safe
    
    if not approved:
        for p_key, p_val in ports.items():
            if p_key != dest:
                if p_val.get("max_draft", 0) >= req.vessel_draft and p_val.get("max_loa", 0) >= req.vessel_loa:
                    alternate_ports.append(AlternatePort(
                        name=p_val.get("name", p_key),
                        max_draft=p_val.get("max_draft", 0),
                        max_loa=p_val.get("max_loa", 0),
                        state=p_val.get("state", ""),
                        notes=p_val.get("notes", "")
                    ))
                    
    status_label = "GATE 1 CLEARED (HYDRODYNAMIC & WEATHER SAFE)" if approved else "NO-GO // PHYSICAL GATE REJECTED"
    
    return SafetyCheckResponse(
        approved=approved,
        draft_margin=draft_margin,
        loa_margin=loa_margin,
        weather_safe=weather_safe,
        reasons=reasons,
        alternate_ports=alternate_ports,
        port_name=port.get("name", dest),
        max_draft=port_max_draft,
        max_loa=port_max_loa,
        vessel_draft=req.vessel_draft,
        vessel_loa=req.vessel_loa,
        wave_height=wave_height,
        wind_speed=wind_speed,
        wave_safe=wave_safe,
        wind_safe=wind_safe,
        status_label=status_label
    )
