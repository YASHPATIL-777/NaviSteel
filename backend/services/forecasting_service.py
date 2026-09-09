import csv
from pathlib import Path
from typing import Dict, Any, List

try:
    from backend.models.schemas import ForecastRequest, ForecastResponse
except ImportError:
    from models.schemas import ForecastRequest, ForecastResponse

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def get_baseline_rate(origin: str, dest: str, vessel: str) -> float:
    csv_path = DATA_DIR / "freight_history.csv"
    if csv_path.exists():
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["origin"].lower() in origin.lower() and row["destination"].lower() in dest.lower():
                    if vessel.lower() in row["vessel_type"].lower():
                        return float(row["baseline_rate_usd"])
    
    if "Australia" in origin:
        if "Dhamra" in dest and "Capesize" in vessel:
            return 11.80
        if "Vizag" in dest:
            return 14.50
        return 14.20
    elif "Indonesia" in origin:
        return 9.80 if "Supramax" in vessel else 10.50
    elif "South Africa" in origin:
        return 13.20 if "Capesize" in vessel else 16.50
    elif "USA" in origin:
        return 28.50
    return 14.20

def generate_freight_forecast(req: ForecastRequest) -> ForecastResponse:
    current_rate = get_baseline_rate(req.origin, req.destination, req.vessel_type)
    
    forecast_30d = round(current_rate * 1.063, 2)
    forecast_90d = round(current_rate * 1.183, 2)
    forecast_180d = round(current_rate * 1.085, 2)
    forecast_12m = round(current_rate * 1.049, 2)
    
    month_names = ["Sep 26", "Oct 26", "Nov 26", "Dec 26", "Jan 27", "Feb 27", "Mar 27", "Apr 27", "May 27", "Jun 27", "Jul 27", "Aug 27"]
    multipliers = [1.00, 1.06, 1.18, 1.12, 1.08, 1.05, 1.09, 1.14, 1.19, 1.25, 1.27, 1.22]
    
    forward_rates = [round(current_rate * m, 2) for m in multipliers]
    lower_bounds = [round(r * 0.92, 2) for r in forward_rates]
    upper_bounds = [round(r * 1.08, 2) for r in forward_rates]
    
    historical_months = ["Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26 (Current)"]
    hist_mults = [0.97, 0.99, 1.02, 1.04, 1.01, 1.00]
    historical_rates = [round(current_rate * hm, 2) for hm in hist_mults]
    
    trend = "RISING" if forecast_90d > current_rate else ("FALLING" if forecast_90d < current_rate else "STABLE")
    confidence = "HIGH (92% CI)"
    optimal_entry_window = "15 Sep - 30 Sep 2026"
    avoided_premium = round(max(0.0, forecast_90d - current_rate) * req.cargo_mt, 2)
    
    return ForecastResponse(
        current_rate=current_rate,
        forecast_30d=forecast_30d,
        forecast_90d=forecast_90d,
        forecast_180d=forecast_180d,
        forecast_12m=forecast_12m,
        lower_bounds=lower_bounds,
        upper_bounds=upper_bounds,
        historical_months=historical_months,
        historical_rates=historical_rates,
        forward_months=month_names,
        forward_rates=forward_rates,
        trend=trend,
        confidence=confidence,
        optimal_entry_window=optimal_entry_window,
        avoided_premium=avoided_premium,
        disclaimer="Prototype Forecast / Simulated Market Dataset"
    )
