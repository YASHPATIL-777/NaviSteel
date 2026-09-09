import os
import json
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from typing import Dict, Any, Optional

def get_fallback_vessel_telemetry(identifier: str = "DEFAULT") -> Dict[str, Any]:
    """
    Returns deterministic, realistic simulated vessel telemetry for demo scenarios.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    
    # Custom variation if specific identifier requested
    ident_upper = (identifier or "").upper()
    if "CAPESIZE" in ident_upper or "DHAMRA" in ident_upper or "SCENARIO_3" in ident_upper:
        return {
            "name": "MV Mineral Dragon",
            "mmsi": "538009871",
            "imo": "9812456",
            "latitude": 17.80,
            "longitude": 85.35,
            "speed_knots": 11.8,
            "course": 320.0,
            "heading": 318.0,
            "draft_m": 17.2,
            "destination": "INDHM (DHAMRA)",
            "eta": "2026-09-15 14:00 UTC",
            "timestamp": now_iso,
            "is_live": False,
            "source": "DEMO / SIMULATED AIS"
        }
    
    return {
        "name": "MV Ocean Pioneer",
        "mmsi": "503000123",
        "imo": "9412345",
        "latitude": 18.25,
        "longitude": 84.10,
        "speed_knots": 12.4,
        "course": 315.0,
        "heading": 314.0,
        "draft_m": 14.2,
        "destination": "INPRT (PARADIP)",
        "eta": "2026-09-14 06:00 UTC",
        "timestamp": now_iso,
        "is_live": False,
        "source": "DEMO / SIMULATED AIS"
    }

def fetch_vessel_ais(identifier: str) -> Dict[str, Any]:
    """
    Adapter for live AIS vessel tracking (Datalastic preferred).
    If DATALASTIC_API_KEY / AIS_API_KEY is not configured or the external request fails,
    gracefully returns normalized demo/simulated telemetry with is_live=False.
    """
    api_key = os.getenv("DATALASTIC_API_KEY") or os.getenv("AIS_API_KEY")
    if not api_key:
        return get_fallback_vessel_telemetry(identifier)

    try:
        ident_str = str(identifier).strip()
        params = {"api-key": api_key}
        
        # Determine query parameter based on identifier format
        if ident_str.isdigit():
            if len(ident_str) == 9:
                params["mmsi"] = ident_str
            elif len(ident_str) == 7:
                params["imo"] = ident_str
            else:
                params["mmsi"] = ident_str
        elif len(ident_str) > 30 and "-" in ident_str:
            params["uuid"] = ident_str
        else:
            params["name"] = ident_str

        query_url = f"https://api.datalastic.com/api/v0/vessel_pro?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(query_url, headers={"User-Agent": "NaviSteel-ControlTower/3.1"})
        
        # 3.0 second timeout for responsiveness
        with urllib.request.urlopen(req, timeout=3.0) as response:
            if response.status == 200:
                raw_data = json.loads(response.read().decode("utf-8"))
                
                # Datalastic payload structure parsing
                v_data = raw_data.get("data") or raw_data
                if isinstance(v_data, list) and len(v_data) > 0:
                    v_data = v_data[0]
                    
                if isinstance(v_data, dict) and (v_data.get("lat") or v_data.get("latitude") or v_data.get("name")):
                    lat = float(v_data.get("lat") or v_data.get("latitude") or 0.0)
                    lon = float(v_data.get("lon") or v_data.get("longitude") or 0.0)
                    speed = float(v_data.get("speed") or v_data.get("speed_knots") or 0.0)
                    course = float(v_data.get("course") or 0.0)
                    heading = float(v_data.get("heading") or course)
                    draft = float(v_data.get("draught") or v_data.get("draft") or v_data.get("draft_m") or 0.0)
                    name = str(v_data.get("name") or v_data.get("vessel_name") or identifier)
                    mmsi = str(v_data.get("mmsi") or "")
                    imo = str(v_data.get("imo") or "")
                    destination = str(v_data.get("destination") or "EAST COAST INDIA")
                    eta = str(v_data.get("eta") or "SCHEDULED")
                    ts = str(v_data.get("last_position_epoch") or datetime.now(timezone.utc).isoformat())

                    return {
                        "name": name,
                        "mmsi": mmsi,
                        "imo": imo,
                        "latitude": lat,
                        "longitude": lon,
                        "speed_knots": speed,
                        "course": course,
                        "heading": heading,
                        "draft_m": draft,
                        "destination": destination,
                        "eta": eta,
                        "timestamp": ts,
                        "is_live": True,
                        "source": "DATALASTIC AIS"
                    }
    except Exception as e:
        # Log failure internally and fall back cleanly
        print(f"[AIS Service] External API call failed or timed out: {e}. Using simulated fallback.")
        
    return get_fallback_vessel_telemetry(identifier)
