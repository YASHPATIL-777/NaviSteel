from fastapi import APIRouter

try:
    from backend.models.schemas import SafetyCheckRequest, SafetyCheckResponse
    from backend.services.safety_service import evaluate_safety_gate
except ImportError:
    from models.schemas import SafetyCheckRequest, SafetyCheckResponse
    from services.safety_service import evaluate_safety_gate

router = APIRouter(prefix="/api/safety", tags=["Safety Gate"])

@router.post("/check", response_model=SafetyCheckResponse)
def check_safety(req: SafetyCheckRequest):
    return evaluate_safety_gate(req)
