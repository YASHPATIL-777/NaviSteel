import json
from pathlib import Path
from typing import Dict, Any

try:
    from backend.models.schemas import StockpileRequest, StockpileResponse
except ImportError:
    from models.schemas import StockpileRequest, StockpileResponse

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_commodity_prices() -> Dict[str, float]:
    path = DATA_DIR / "commodity_prices.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"Coking Coal": 220.0, "Thermal Coal": 110.0, "PCI Coal": 180.0, "Iron Ore": 105.0, "Limestone": 45.0}

def calculate_stockpile_strategy(req: StockpileRequest) -> StockpileResponse:
    prices = load_commodity_prices()
    comm_price = prices.get(req.cargo_type, 220.0)
    
    # Avoided Price Spike
    avoided_price_spike = round(max(0.0, req.forecast_future_rate - req.current_rate) * req.cargo_mt, 2)
    
    # Avoided Demurrage ($980,000 baseline for 100k MT lot in peak monsoon window)
    avoided_demurrage = round(980000.0 * (req.cargo_mt / 100000.0), 2)
    
    # Disruption Cushion
    disruption_cushion = round(0.0, 2)
    
    total_benefit = round(avoided_price_spike + avoided_demurrage, 2)
    
    # Yard Storage Cost: storage_rate * cargo_mt * holding_days ($54,000)
    storage_cost = round(req.storage_rate_per_day * req.cargo_mt * req.holding_days, 2)
    
    # Capital Lock-in: Cargo Value * Annual Rate * (holding_days / 365) ($108,493.15)
    cargo_value = req.cargo_mt * comm_price
    capital_lockin_cost = round(cargo_value * req.annual_capital_rate * (req.holding_days / 365.0), 2)
    
    total_carrying_cost = round(storage_cost + capital_lockin_cost, 2)
    
    net_strategic_benefit = round(total_benefit - total_carrying_cost, 2)
    
    if net_strategic_benefit >= 500000.0:
        recommendation = "OPTIMAL (ADVANCE PROCUREMENT STRATEGY)"
        rec_class = "optimal"
    elif net_strategic_benefit >= 0.0:
        recommendation = "MODERATE BENEFIT (HOLD & MONITOR)"
        rec_class = "hold"
    else:
        recommendation = "DEFER (NEGATIVE STRATEGIC VALUE)"
        rec_class = "defer"
        
    breakdown_text = (
        f"Avoided freight rate spike (${avoided_price_spike:,.0f}) and post-monsoon berth demurrage (${avoided_demurrage:,.0f}) "
        f"exceed total yard inventory holding & capital carry costs (${total_carrying_cost:,.0f}), "
        f"generating a net strategic value of ${net_strategic_benefit:,.0f}."
    )
    
    return StockpileResponse(
        avoided_price_spike=avoided_price_spike,
        avoided_demurrage=avoided_demurrage,
        disruption_cushion=disruption_cushion,
        total_benefit=total_benefit,
        storage_cost=storage_cost,
        capital_lockin_cost=capital_lockin_cost,
        total_carrying_cost=total_carrying_cost,
        net_strategic_benefit=net_strategic_benefit,
        recommendation=recommendation,
        recommendation_class=rec_class,
        commodity_benchmark_price=comm_price,
        breakdown_text=breakdown_text
    )
