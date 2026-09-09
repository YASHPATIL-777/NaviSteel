from fastapi import APIRouter

try:
    from backend.models.schemas import VesselOptimizeRequest, VesselOptimizeResponse
    from backend.services.vessel_optimizer import optimize_vessel_selection
except ImportError:
    from models.schemas import VesselOptimizeRequest, VesselOptimizeResponse
    from services.vessel_optimizer import optimize_vessel_selection

router = APIRouter(prefix="/api/vessels", tags=["Vessel Optimization"])

@router.post("/optimize", response_model=VesselOptimizeResponse)
def optimize_vessels(req: VesselOptimizeRequest):
    return optimize_vessel_selection(req)
