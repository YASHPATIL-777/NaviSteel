from fastapi import APIRouter

try:
    from backend.models.schemas import AlertsRequest, AlertsResponse
    from backend.services.alert_service import evaluate_disruption_alerts
except ImportError:
    from models.schemas import AlertsRequest, AlertsResponse
    from services.alert_service import evaluate_disruption_alerts

router = APIRouter(prefix="/api/alerts", tags=["Early Warning Alerts"])

@router.post("/evaluate", response_model=AlertsResponse)
def evaluate_alerts(req: AlertsRequest):
    return evaluate_disruption_alerts(req)
