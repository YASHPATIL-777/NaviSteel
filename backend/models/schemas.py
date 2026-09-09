from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SafetyCheckRequest(BaseModel):
    origin: str = Field(default="Australia")
    destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    cargo_mt: float = Field(default=100000.0)
    vessel_type: str = Field(default="Panamax")
    vessel_draft: float = Field(default=14.8)
    vessel_loa: float = Field(default=229.0)
    wave_height: Optional[float] = None
    wind_speed: Optional[float] = None

class AlternatePort(BaseModel):
    name: str
    max_draft: float
    max_loa: float
    state: str
    notes: str

class SafetyCheckResponse(BaseModel):
    approved: bool
    draft_margin: float
    loa_margin: float
    weather_safe: bool
    reasons: List[str] = []
    alternate_ports: List[AlternatePort] = []
    port_name: str
    max_draft: float
    max_loa: float
    vessel_draft: float
    vessel_loa: float
    wave_height: float
    wind_speed: float
    wave_safe: bool
    wind_safe: bool
    status_label: str

class ForecastRequest(BaseModel):
    origin: str = Field(default="Australia")
    destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    cargo_mt: float = Field(default=100000.0)
    vessel_type: str = Field(default="Panamax")
    contract_horizon: str = Field(default="short")
    booking_date: Optional[str] = None

class ForecastResponse(BaseModel):
    current_rate: float
    forecast_30d: float
    forecast_90d: float
    forecast_180d: float
    forecast_12m: float
    lower_bounds: List[float]
    upper_bounds: List[float]
    historical_months: List[str]
    historical_rates: List[float]
    forward_months: List[str]
    forward_rates: List[float]
    trend: str
    confidence: str
    optimal_entry_window: str
    avoided_premium: float
    disclaimer: str = "Prototype Forecast / Simulated Market Dataset"

class VesselOptimizeRequest(BaseModel):
    destination: str = Field(default="Paradip")
    cargo_mt: float = Field(default=100000.0)
    current_rate: float = Field(default=14.20)
    vessel_type: Optional[str] = None
    vessel_draft: Optional[float] = None
    vessel_loa: Optional[float] = None

class VesselOption(BaseModel):
    rank: int
    vessel_type: str
    dwt_capacity: float
    draft: float
    loa: float
    compliant: bool
    rejection_reason: Optional[str] = None
    utilization_pct: float
    voyages_required: int
    freight_rate: float
    total_freight_usd: float
    demurrage_rate: float
    is_best_fit: bool
    score: float

class VesselOptimizeResponse(BaseModel):
    best_fit_vessel: Optional[str]
    rankings: List[VesselOption]
    explanation: str

# -------------------------------------------------------------
# Multiple-Voyage Contract Planner Models
# -------------------------------------------------------------
class ContractPlanRequest(BaseModel):
    origin: str = Field(default="Australia")
    destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    annual_demand_mt: float = Field(default=600000.0)
    parcel_size_mt: float = Field(default=100000.0)
    planning_horizon: str = Field(default="short") # "spot", "short", "medium"
    preferred_vessel_type: str = Field(default="Panamax")
    current_spot_rate: Optional[float] = None

class ContractOption(BaseModel):
    strategy_key: str # "spot", "short_term", "medium_term"
    strategy_name: str
    horizon_label: str
    effective_rate_per_mt: float
    number_of_voyages: int
    total_freight_spend_usd: float
    rate_volatility_pct: float
    operational_risk: str # "HIGH", "MEDIUM", "LOW"
    flexibility_score: int # 0-100
    commitment_score: int # 0-100
    expected_savings_vs_spot: float
    is_recommended: bool

class ContractPlanResponse(BaseModel):
    recommended_strategy: str
    recommended_strategy_name: str
    annual_savings_vs_spot: float
    annual_demand_mt: float
    voyages_planned: int
    options: List[ContractOption]
    rationale: List[str]
    disclaimer: str = "Prototype Contract Simulation Model"

# -------------------------------------------------------------
# Idle & Alternative Employment Models
# -------------------------------------------------------------
class IdleStrategyRequest(BaseModel):
    vessel_type: str = Field(default="Panamax")
    current_position: str = Field(default="Australia")
    current_destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    cargo_quantity: float = Field(default=100000.0)
    daily_vessel_cost: Optional[float] = None

class IdleAlternative(BaseModel):
    id: str
    strategy_type: str
    title: str
    description: str
    route: str
    cargo: str
    expected_idle_days: float
    idle_reduction_days: float
    financial_impact_usd: float
    financial_type: str # "SAVINGS", "REVENUE", "LOSS"
    deadheading_risk: str
    recommendation_rank: int
    action_label: str

class IdleStrategyResponse(BaseModel):
    baseline_idle_days: float
    daily_vessel_cost_usd: float
    baseline_idle_loss_usd: float
    recommended_strategy: str
    recommended_action: str
    potential_savings_usd: float
    alternatives: List[IdleAlternative]
    disclaimer: str = "Simulated Vessel Positioning & Idle Optimization"

# -------------------------------------------------------------
# Early Warning / Disruption Alert Models
# -------------------------------------------------------------
class AlertsRequest(BaseModel):
    destination: str = Field(default="Paradip")
    origin: str = Field(default="Australia")
    vessel_type: str = Field(default="Panamax")
    month_num: Optional[int] = Field(default=9)

class DisruptionAlert(BaseModel):
    alert_type: str # "PORT_CONGESTION", "FREIGHT_VOLATILITY", "MONSOON_SWELL", "RAIL_LOGISTICS", etc.
    title: str
    severity: str # "CRITICAL", "HIGH", "MODERATE", "LOW"
    port: str
    route: str
    probability_pct: int
    expected_delay_days: float
    estimated_exposure_usd: float
    recommended_action: str
    source_type: str # "Hydrodynamic Swell Telemetry", "Econometric Curve", "Rail Rake Tracker"

class AlertsResponse(BaseModel):
    composite_risk_score: int # 0-100
    risk_level: str # "CRITICAL", "HIGH", "MODERATE", "LOW"
    score_breakdown: Dict[str, float]
    active_alerts_count: int
    top_alert: Optional[DisruptionAlert]
    alerts: List[DisruptionAlert]
    disclaimer: str = "Prototype Multi-Factor Early Warning System"

# -------------------------------------------------------------
# Module A Stockpile Models
# -------------------------------------------------------------
class StockpileRequest(BaseModel):
    cargo_type: str = Field(default="Coking Coal")
    cargo_mt: float = Field(default=100000.0)
    current_rate: float = Field(default=14.20)
    forecast_future_rate: float = Field(default=16.80)
    holding_days: int = Field(default=60)
    storage_rate_per_day: float = Field(default=0.009)
    annual_capital_rate: float = Field(default=0.085)
    destination: str = Field(default="Paradip")

class StockpileResponse(BaseModel):
    avoided_price_spike: float
    avoided_demurrage: float
    disruption_cushion: float
    total_benefit: float
    storage_cost: float
    capital_lockin_cost: float
    total_carrying_cost: float
    net_strategic_benefit: float
    recommendation: str
    recommendation_class: str
    commodity_benchmark_price: float
    breakdown_text: str

# -------------------------------------------------------------
# Module B Risk Models
# -------------------------------------------------------------
class RiskMatrixRequest(BaseModel):
    destination: str = Field(default="Paradip")

class MonthlyRiskItem(BaseModel):
    month_num: int
    month_name: str
    risk_score: int
    monsoon_factor: float
    cyclone_factor: float
    congestion_factor: float
    demurrage_exposure_usd: float
    delay_days: float
    draft_risk: str
    rake_availability_pct: int
    recommended_action: str
    risk_level: str

class RiskMatrixResponse(BaseModel):
    months: List[MonthlyRiskItem]
    highest_risk_month: str
    lowest_risk_month: str
    disclaimer: str = "Simulated 12-Month Multi-Factor Risk Assessment"

# -------------------------------------------------------------
# Module C Co-Loading Models
# -------------------------------------------------------------
class ColoadRequest(BaseModel):
    origin: str = Field(default="Australia")
    destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    cargo_mt: float = Field(default=100000.0)
    vessel_type: str = Field(default="Panamax")

class ColoadOpportunity(BaseModel):
    id: str
    partner: str
    psu_type: str
    origin: str
    discharge_port: str
    cargo_type: str
    cargo_available_mt: float
    vessel_class: str
    laycan_window: str
    status: str
    match_score: int
    synergistic_savings_usd: float
    co2_reduction_mt: float
    route_deviation_nm: int
    notes: str

class ColoadResponse(BaseModel):
    best_match: Optional[ColoadOpportunity]
    opportunities: List[ColoadOpportunity]
    total_opportunities: int
    disclaimer: str = "Prototype / Simulated Coordination Dataset"

# -------------------------------------------------------------
# Master Executive Decision Directive Models
# -------------------------------------------------------------
class ExecutiveDecisionRequest(BaseModel):
    origin: str = Field(default="Australia")
    destination: str = Field(default="Paradip")
    cargo_type: str = Field(default="Coking Coal")
    cargo_mt: float = Field(default=100000.0)
    vessel_type: str = Field(default="Panamax")
    vessel_draft: float = Field(default=14.8)
    vessel_loa: float = Field(default=229.0)
    is_approved: bool = True
    forecast_rate: Optional[float] = None
    best_vessel: Optional[str] = None
    contract_type: Optional[str] = None
    net_stockpile_benefit: Optional[float] = None
    annual_savings_usd: Optional[float] = None
    idle_risk_level: Optional[str] = None
    top_active_alert: Optional[str] = None

class ExecutiveDecisionResponse(BaseModel):
    status: str
    status_label: str
    is_approved: bool
    recommended_vessel: str
    route: str
    contract_type: str
    entry_window: str
    forecast_freight: str
    estimated_savings: str
    annual_contract_savings: str
    idle_risk: str
    active_alert_summary: str
    risk_level: str
    confidence_score: str
    reasons: List[str]
    digital_signature: str

class WeatherResponse(BaseModel):
    port: str
    latitude: float
    longitude: float
    wave_height_m: float
    wind_speed_kmh: float
    wave_safe: bool
    wind_safe: bool
    safe_for_berthing: bool
    is_live_api: bool
    timestamp: str
    fallback_reason: Optional[str] = None
