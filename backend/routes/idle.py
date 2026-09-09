from fastapi import APIRouter

try:
    from backend.models.schemas import IdleStrategyRequest, IdleStrategyResponse
    from backend.services.idle_service import evaluate_idle_strategy
except ImportError:
    from models.schemas import IdleStrategyRequest, IdleStrategyResponse
    from services.idle_service import evaluate_idle_strategy

router = APIRouter(prefix="/api/strategy/idle", tags=["Idle Management"])

@router.post("", response_model=IdleStrategyResponse)
def get_idle_strategy(req: IdleStrategyRequest):
    return evaluate_idle_strategy(req)
