from fastapi import APIRouter

try:
    from backend.models.schemas import (
        StockpileRequest, StockpileResponse,
        RiskMatrixRequest, RiskMatrixResponse,
        ColoadRequest, ColoadResponse
    )
    from backend.services.stockpile_service import calculate_stockpile_strategy
    from backend.services.risk_service import calculate_monthly_risk_matrix
    from backend.services.coloading_service import match_coloading_opportunities
except ImportError:
    from models.schemas import (
        StockpileRequest, StockpileResponse,
        RiskMatrixRequest, RiskMatrixResponse,
        ColoadRequest, ColoadResponse
    )
    from services.stockpile_service import calculate_stockpile_strategy
    from services.risk_service import calculate_monthly_risk_matrix
    from services.coloading_service import match_coloading_opportunities

router = APIRouter(prefix="/api/strategy", tags=["Strategic Procurement"])

@router.post("/stockpile", response_model=StockpileResponse)
def get_stockpile_strategy(req: StockpileRequest):
    return calculate_stockpile_strategy(req)

@router.post("/risk", response_model=RiskMatrixResponse)
def get_risk_matrix(req: RiskMatrixRequest):
    return calculate_monthly_risk_matrix(req)

@router.post("/coload", response_model=ColoadResponse)
def get_coloading_matches(req: ColoadRequest):
    return match_coloading_opportunities(req)
