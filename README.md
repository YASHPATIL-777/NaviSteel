# NaviSteel Control Tower // SIH 2026

**Problem Statement:** `SIH26006` — *Development of an Intelligent Freight Forecasting Model for Optimized Vessel Chartering and Bulk Cargo Procurement from Overseas to East Coast of India*  
**Target Organization:** Ministry of Steel / Steel Authority of India Limited (SAIL)  
**Architecture:** Decoupled High-Performance FastAPI Python Backend + Modular Vanilla JavaScript & CSS Frontend

---

## 1. System Architecture Overview

NaviSteel implements an end-to-end **Maritime Decision Intelligence Pipeline**:

```
                                  [ Bulk Procurement Order ]
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │  GATEKEEPER 1: HYDRODYNAMIC GATE │
                             │  - Laden Draft vs Max Draft Limit│
                             │  - Vessel LOA vs Berth LOA Limit │
                             │  - Live MetOcean Swell (< 2.5m)  │
                             │  - Live MetOcean Wind (< 40km/h) │
                             └────────────────┬─────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
             [ REJECTED: NO-GO ]                              [ APPROVED: GO ]
      • Automatic DG Shipping Alert                   • Multi-Vessel Economic Optimizer
      • Alternate Deep-Water Routing                  • 12-Month Forward Freight Curve
      • Berth Infrastructure Protection               • Multiple-Voyage Contract Planner
                                                      • Early Warning Alert Center
                                                      • Peak Season Stockpile Engine
                                                      • Idle & Alternative Employment
                                                      • Inter-PSU Co-Loading Radar
                                                      • Master Executive Directive
```

---

## 2. Directory Structure

```
NaviSteel-main/
│
├── backend/
│   ├── main.py                         # FastAPI Application Entrypoint & CORS Setup
│   ├── requirements.txt                # Production Dependencies (fastapi, uvicorn, pydantic, httpx)
│   │
│   ├── routes/
│   │   ├── safety.py                   # POST /api/safety/check
│   │   ├── forecast.py                 # POST /api/freight/forecast
│   │   ├── vessels.py                  # POST /api/vessels/optimize
│   │   ├── contracts.py                # POST /api/contracts/plan
│   │   ├── alerts.py                   # POST /api/alerts/evaluate
│   │   ├── strategy.py                 # POST /api/strategy/{stockpile,risk,coload}
│   │   ├── idle.py                     # POST /api/strategy/idle
│   │   ├── weather.py                  # GET  /api/weather/{port_name}
│   │   └── decision.py                 # POST /api/decision
│   │
│   ├── services/
│   │   ├── safety_service.py           # Physical Draft/LOA & Hydrodynamic Screening
│   │   ├── forecasting_service.py      # Multi-horizon Econometric Forward Curve
│   │   ├── vessel_optimizer.py         # Multi-Class Sizing & Utilization Ranking
│   │   ├── contract_planner.py         # Spot vs Short-Term vs Medium-Term COA Sizing
│   │   ├── alert_service.py            # Transparent Composite Risk & Actionable Warnings
│   │   ├── stockpile_service.py        # Peak Season Dynamic Carrying Cost Engine
│   │   ├── idle_service.py             # Inactive Vessel Loss & Positioning Optimizer
│   │   ├── risk_service.py             # 12-Month Swell, Siltation & Rake Model
│   │   └── coloading_service.py        # Inter-PSU Radar & Synergy Matchmaker
│   │
│   ├── models/
│   │   └── schemas.py                  # Strongly-Typed Pydantic Request/Response Models
│   │
│   └── data/
│       ├── ports.json                  # Physical Specifications for 7 Major East Coast Ports
│       ├── vessels.json                # Vessel Class Baselines (Handy, Supra, Pana, Cape)
│       ├── freight_history.csv         # Historical Freight Benchmark Matrix
│       ├── contract_assumptions.json   # Multi-Voyage Parameters & Volatility Premia
│       ├── idle_opportunities.json     # Coastal Backhaul & Positioning Registry
│       ├── alert_thresholds.json       # Weighted Risk Model & Disruption Trigger Matrix
│       ├── seasonal_risk.json          # 12-Month Climatological & Rake Risk Dataset
│       ├── coloading_opportunities.json# Inter-PSU Cargo Sharing Registry (SAIL/RINL/NMDC/CIL)
│       └── commodity_prices.json       # Raw Material Pricing Benchmarks
│
├── frontend/
│   ├── index.html                      # Semantic Markup & Command Center Shell
│   │
│   ├── css/
│   │   └── styles.css                  # Dark Maritime Design System & Glassmorphism
│   │
│   └── js/
│       ├── config.js                   # API Base URLs & Scenario Presets
│       ├── api.js                      # Fetch Client for Backend Endpoints
│       ├── safetyGate.js               # Gate 1 Telemetry & Rejection Modal Controller
│       ├── freightForecast.js          # SVG Forward Curve Chart & Confidence Corridor
│       ├── vesselOptimizer.js          # Multi-Vessel Ranking Table Renderer
│       ├── contractPlanner.js          # Multiple-Voyage Matrix & Savings Renderer
│       ├── alerts.js                   # Early Warning Risk Gauge & Directives
│       ├── stockpiling.js              # Module A Financial Breakdown & Modal
│       ├── idleManagement.js           # Idle Loss Mitigation & Positioning Options
│       ├── riskPlanner.js              # Module B 12-Month Interactive Heatmap
│       ├── coLoading.js                # Module C AIS Radar & Synergy Match Cards
│       ├── executiveDecision.js        # Master Executive Directive Card Renderer
│       └── app.js                      # State Orchestrator & Web Audio Synthesizer
│
├── README.md                           # Master Project Documentation
└── .gitignore                          # Standard Ignores
```

---

## 3. Fast Setup & Execution

### Prerequisites
- Python 3.9+
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### Step 1: Start Backend Server (Port 8000)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*API Swagger Documentation is available at `http://localhost:8000/docs`*

### Step 2: Start Frontend Server (Port 5500)
```bash
cd frontend
python -m http.server 5500
```

### Step 3: Open Control Tower
Navigate to `http://localhost:5500` in your web browser.

---

## 4. API Endpoints Reference

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and active engines declarations |
| `POST` | `/api/safety/check` | Physical hydrodynamic draft/LOA & MetOcean wave/wind check |
| `POST` | `/api/freight/forecast` | Forward curve generation (30d, 90d, 180d, 12M) + optimal entry window |
| `POST` | `/api/vessels/optimize` | Multi-vessel PIANC ranking & cargo utilization calculation |
| `POST` | `/api/contracts/plan` | Multiple-voyage contract planner (Spot vs Short-Term vs Medium-Term COA) |
| `POST` | `/api/alerts/evaluate` | Multi-factor early warning & disruption alert center |
| `POST` | `/api/strategy/stockpile` | Peak season stockpile math (Avoided Spikes vs Holding Costs) |
| `POST` | `/api/strategy/idle` | Vessel idle time minimization & positioning optimizer |
| `POST` | `/api/strategy/risk` | 12-month risk matrix with monsoon swell & railway rake metrics |
| `POST` | `/api/strategy/coload` | Inter-PSU ship sharing & AIS co-loading match scoring |
| `POST` | `/api/decision` | Master executive procurement directive synthesis |
| `GET` | `/api/weather/{port}` | Real-time Open-Meteo marine wave/wind proxy |

---

## 5. Live SIH 2026 Demo Scenarios

1. **Scenario 1: Australia ➔ Paradip (100,000 MT Coking Coal)**
   - *Result:* Gate 1 Approved. Panamax selected as Rank #1 Best Fit (96.2% utilization, $1.42M freight). Short-Term Multiple Voyage Contract recommended generating **+$1,362,000/year** savings vs repeated spot procurement. Stockpile Net Benefit: +$1.08M. Active Alert: Post-Monsoon Berth Congestion (78% probability).
2. **Scenario 2: Indonesia ➔ Vizag (50,000 MT Thermal Coal)**
   - *Result:* Gate 1 Approved. Supramax selected as Rank #1 Best Fit ($9.80/MT). Contract planner locks multi-voyage program saving **+$942,000/year**.
3. **Scenario 3: Australia ➔ Dhamra (150,000 MT Coking Coal)**
   - *Result:* Gate 1 Approved. Deep-water port accommodates Capesize Rank #1 Best Fit. Matched with SAIL IISCO for shared vessel co-loading, generating **+$280,000** synergistic savings and eliminating **510 MT $\text{CO}_2$**. Idle engine cuts inactive days from 4.8d to 0.8d.
4. **Scenario 4: Unsafe Draft @ Vizag (120,000 MT Capesize with 17.5m Draft)**
   - *Result:* Gate 1 **REJECTED** (Draft 17.5m > Port Limit 14.5m by 3.0m). Red alert modal triggered. Executive Directive issues `NO-GO // DISCHARGE PROHIBITED` with recommended diversion to Gangavaram (18.5m draft). Downstream contracting blocked.

---

## 6. Data Integrity & Transparent Disclaimers

- **Weather Telemetry:** Live sync with the Open-Meteo Marine & Atmospheric API.
- **Freight Forecasts:** Econometric model calibrated against historical Baltic Supramax/Panamax indices (`Prototype Forecast / Simulated Market Dataset`).
- **Inter-PSU Collaboration:** Modeled on representative bulk procurement schedules (`Prototype / Simulated Coordination Dataset`).
- **Contract Simulations:** Calculated from standard Baltic multi-voyage turnaround and risk parameters (`Prototype Contract Simulation Model`).
