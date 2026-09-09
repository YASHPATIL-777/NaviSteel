from fastapi import APIRouter
from typing import Optional

try:
    from backend.models.schemas import AISVesselResponse
    from backend.services.ais_service import fetch_vessel_ais
except ImportError:
    from models.schemas import AISVesselResponse
    from services.ais_service import fetch_vessel_ais

router = APIRouter(prefix="/api/ais", tags=["AIS Vessel Telemetry"])

@router.get("/vessel/{identifier}", response_model=AISVesselResponse)
def get_vessel_telemetry(identifier: str):
    """
    Fetch normalized AIS telemetry for a vessel given MMSI, IMO, UUID, or vessel name.
    Automatically queries live AIS provider (Datalastic) if API key is configured,
    otherwise cleanly falls back to simulated demo telemetry.
    """
    result = fetch_vessel_ais(identifier)
    return AISVesselResponse(**result)
