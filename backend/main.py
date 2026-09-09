import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.routes import safety, forecast, vessels, strategy, weather, decision, contracts, idle, alerts, ais
except ImportError:
    from routes import safety, forecast, vessels, strategy, weather, decision, contracts, idle, alerts, ais

app = FastAPI(
    title="NaviSteel Control Tower API",
    description="Intelligent Bulk Cargo Procurement & Freight Forecasting Engine (SIH26006)",
    version="3.1.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(safety.router)
app.include_router(forecast.router)
app.include_router(vessels.router)
app.include_router(contracts.router)
app.include_router(alerts.router)
app.include_router(strategy.router)
app.include_router(idle.router)
app.include_router(weather.router)
app.include_router(decision.router)
app.include_router(ais.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "NaviSteel Control Tower Backend",
        "version": "3.1.0",
        "gatekeepers_active": [
            "Gate 1: Physical & Hydrodynamic Safety Gate",
            "Gate 2: Multi-Vessel Economic Optimizer"
        ],
        "engines_active": [
            "Multiple-Voyage Contract Planner",
            "Idle & Alternative Employment Engine",
            "Early Warning & Disruption Alert Center",
            "Peak Season Stockpiling Engine",
            "Inter-PSU Co-Loading Radar"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
