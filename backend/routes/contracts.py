from fastapi import APIRouter

try:
    from backend.models.schemas import ContractPlanRequest, ContractPlanResponse
    from backend.services.contract_planner import plan_procurement_contracts
except ImportError:
    from models.schemas import ContractPlanRequest, ContractPlanResponse
    from services.contract_planner import plan_procurement_contracts

router = APIRouter(prefix="/api/contracts", tags=["Contract Planner"])

@router.post("/plan", response_model=ContractPlanResponse)
def plan_contracts(req: ContractPlanRequest):
    return plan_procurement_contracts(req)
