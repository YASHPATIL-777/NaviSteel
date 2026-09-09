from fastapi import APIRouter

try:
    from backend.models.schemas import ForecastRequest, ForecastResponse
    from backend.services.forecasting_service import generate_freight_forecast
except ImportError:
    from models.schemas import ForecastRequest, ForecastResponse
    from services.forecasting_service import generate_freight_forecast

router = APIRouter(prefix="/api/freight", tags=["Freight Forecasting"])

@router.post("/forecast", response_model=ForecastResponse)
def get_forecast(req: ForecastRequest):
    return generate_freight_forecast(req)
