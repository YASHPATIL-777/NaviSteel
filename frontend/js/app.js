import { CONFIG } from './config.js';
import { API } from './api.js';
import { renderSafetyGate, showRejectionModal } from './safetyGate.js';
import { renderFreightForecast } from './freightForecast.js';
import { renderVesselOptimization } from './vesselOptimizer.js';
import { renderContractPlanner } from './contractPlanner.js';
import { renderDisruptionAlerts } from './alerts.js';
import { renderStockpileCard, showStockpileModal } from './stockpiling.js';
import { renderIdleManagement } from './idleManagement.js';
import { renderRiskCard, showRiskModal } from './riskPlanner.js';
import { renderColoadCard, showColoadModal } from './coLoading.js';
import { renderExecutiveDecision } from './executiveDecision.js';

// Application State Store
let state = {
  currentScenario: 1,
  origin: "Australia (Gladstone / Hay Point)",
  destination: "Paradip",
  cargo_type: "Coking Coal",
  cargo_mt: 100000,
  vessel_type: "Panamax",
  vessel_draft: 14.8,
  vessel_loa: 229.0,
  safety: null,
  forecast: null,
  vessels: null,
  contracts: null,
  alerts: null,
  stockpile: null,
  idle: null,
  risk: null,
  coload: null,
  decision: null
};

// Web Audio Synthesizer
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playTone(freq, type = "sine", duration = 0.2, delay = 0) {
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch (e) {
    // Ignore autoplay limitations
  }
}

function playSuccessChime() {
  playTone(523.25, "sine", 0.15, 0);
  playTone(659.25, "sine", 0.15, 0.12);
  playTone(783.99, "sine", 0.3, 0.24);
}

function playRejectionSiren() {
  playTone(440, "sawtooth", 0.2, 0);
  playTone(330, "sawtooth", 0.25, 0.18);
  playTone(220, "sawtooth", 0.35, 0.35);
}

// Master Execution Flow
export async function executePipeline() {
  try {
    // 1. Check Safety Gate (Gate 1)
    const safetyPayload = {
      origin: state.origin,
      destination: state.destination,
      cargo_type: state.cargo_type,
      cargo_mt: state.cargo_mt,
      vessel_type: state.vessel_type,
      vessel_draft: state.vessel_draft,
      vessel_loa: state.vessel_loa
    };
    
    const safetyRes = await API.checkSafety(safetyPayload);
    state.safety = safetyRes;
    
    renderSafetyGate(safetyRes, (data) => {
      playRejectionSiren();
      showRejectionModal(data);
    });
    
    if (!safetyRes.approved) {
      playRejectionSiren();
      showRejectionModal(safetyRes);
    }
    
    // 2. Query Freight Forecast
    const forecastPayload = {
      origin: state.origin,
      destination: state.destination,
      cargo_type: state.cargo_type,
      cargo_mt: state.cargo_mt,
      vessel_type: state.vessel_type
    };
    const forecastRes = await API.getForecast(forecastPayload);
    state.forecast = forecastRes;
    renderFreightForecast(forecastRes);
    
    // 3. Query Vessel Optimizer
    const vesselPayload = {
      destination: state.destination,
      cargo_mt: state.cargo_mt,
      current_rate: forecastRes.current_rate,
      vessel_type: state.vessel_type,
      vessel_draft: state.vessel_draft,
      vessel_loa: state.vessel_loa
    };
    const vesselRes = await API.optimizeVessels(vesselPayload);
    state.vessels = vesselRes;
    renderVesselOptimization(vesselRes);
    
    // 4. Query Multiple-Voyage Contract Planner
    const contractPayload = {
      origin: state.origin,
      destination: state.destination,
      cargo_type: state.cargo_type,
      annual_demand_mt: 600000.0,
      parcel_size_mt: state.cargo_mt,
      preferred_vessel_type: vesselRes.best_fit_vessel || state.vessel_type,
      current_spot_rate: forecastRes.current_rate
    };
    const contractRes = await API.planContracts(contractPayload);
    state.contracts = contractRes;
    renderContractPlanner(contractRes);
    
    // 5. Query Early Warning / Disruption Alert Center
    const alertPayload = {
      destination: state.destination,
      origin: state.origin,
      vessel_type: state.vessel_type,
      month_num: 9
    };
    const alertRes = await API.getAlerts(alertPayload);
    state.alerts = alertRes;
    renderDisruptionAlerts(alertRes);
    
    // 6. Query Dynamic Stockpiling (Module A)
    const stockpilePayload = {
      cargo_type: state.cargo_type,
      cargo_mt: state.cargo_mt,
      current_rate: forecastRes.current_rate,
      forecast_future_rate: forecastRes.forecast_90d,
      destination: state.destination
    };
    const stockpileRes = await API.getStockpileStrategy(stockpilePayload);
    state.stockpile = stockpileRes;
    renderStockpileCard(stockpileRes);
    
    // 7. Query Idle Management & Alternative Employment
    const idlePayload = {
      vessel_type: vesselRes.best_fit_vessel || state.vessel_type,
      current_position: state.origin,
      current_destination: state.destination,
      cargo_type: state.cargo_type,
      cargo_quantity: state.cargo_mt
    };
    const idleRes = await API.getIdleStrategy(idlePayload);
    state.idle = idleRes;
    renderIdleManagement(idleRes);
    
    // 8. Query 12-Month Risk Curve (Module B)
    const riskRes = await API.getRiskMatrix(state.destination);
    state.risk = riskRes;
    renderRiskCard(riskRes);
    
    // 9. Query Inter-PSU Co-Loading (Module C)
    const coloadPayload = {
      origin: state.origin,
      destination: state.destination,
      cargo_type: state.cargo_type,
      cargo_mt: state.cargo_mt,
      vessel_type: state.vessel_type
    };
    const coloadRes = await API.getColoadingMatches(coloadPayload);
    state.coload = coloadRes;
    renderColoadCard(coloadRes);
    
    // 10. Query Master Executive Decision Directive
    const topAlertTitle = alertRes.top_alert ? alertRes.top_alert.title : "POST-MONSOON CONGESTION WATCH";
    const decisionPayload = {
      origin: state.origin,
      destination: state.destination,
      cargo_type: state.cargo_type,
      cargo_mt: state.cargo_mt,
      vessel_type: state.vessel_type,
      vessel_draft: state.vessel_draft,
      vessel_loa: state.vessel_loa,
      is_approved: safetyRes.approved,
      forecast_rate: forecastRes.current_rate,
      best_vessel: vesselRes.best_fit_vessel,
      contract_type: contractRes.recommended_strategy_name,
      net_stockpile_benefit: stockpileRes.net_strategic_benefit,
      annual_savings_usd: contractRes.annual_savings_vs_spot,
      idle_risk_level: "LOW // CO-LOAD OPTIMIZED",
      top_active_alert: topAlertTitle
    };
    const decisionRes = await API.getExecutiveDecision(decisionPayload);
    state.decision = decisionRes;
    renderExecutiveDecision(decisionRes);
    
  } catch (err) {
    console.error("Pipeline execution failed:", err);
  }
}

// Load Scenario Preset
export function loadScenario(scenarioId) {
  const sc = CONFIG.SCENARIOS[scenarioId];
  if (!sc) return;
  
  state.currentScenario = scenarioId;
  state.origin = sc.origin;
  state.destination = sc.destination;
  state.cargo_type = sc.cargo_type;
  state.cargo_mt = sc.cargo_mt;
  state.vessel_type = sc.vessel_type;
  state.vessel_draft = sc.vessel_draft;
  state.vessel_loa = sc.vessel_loa;
  
  // Update Form UI
  document.getElementById("originSelect").value = sc.origin;
  document.getElementById("destSelect").value = sc.destination;
  document.getElementById("cargoTypeSelect").value = sc.cargo_type;
  document.getElementById("cargoQuantityInput").value = sc.cargo_mt;
  document.getElementById("cargoQuantitySlider").value = sc.cargo_mt;
  document.getElementById("cargoQuantityVal").innerText = `${(sc.cargo_mt / 1000).toFixed(0)}k MT`;
  document.getElementById("vesselTypeSelect").value = sc.vessel_type;
  document.getElementById("vesselDraftInput").value = sc.vessel_draft;
  document.getElementById("vesselDraftSlider").value = sc.vessel_draft;
  document.getElementById("vesselDraftVal").innerText = `${sc.vessel_draft.toFixed(1)}m`;
  document.getElementById("vesselLoaInput").value = sc.vessel_loa;
  
  // Update Active Button Style
  document.querySelectorAll(".scenario-btn").forEach((btn, idx) => {
    if (idx + 1 === scenarioId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  if (scenarioId === 4) {
    playRejectionSiren();
  } else {
    playSuccessChime();
  }
  
  executePipeline();
}

// Initialize UI Bindings
window.addEventListener("DOMContentLoaded", () => {
  // Scenario Buttons
  document.querySelectorAll(".scenario-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sId = parseInt(btn.getAttribute("data-scenario"));
      loadScenario(sId);
    });
  });
  
  // Form Inputs
  document.getElementById("destSelect").addEventListener("change", (e) => {
    state.destination = e.target.value;
    executePipeline();
  });
  
  document.getElementById("originSelect").addEventListener("change", (e) => {
    state.origin = e.target.value;
    executePipeline();
  });
  
  document.getElementById("cargoTypeSelect").addEventListener("change", (e) => {
    state.cargo_type = e.target.value;
    executePipeline();
  });
  
  document.getElementById("vesselTypeSelect").addEventListener("change", (e) => {
    state.vessel_type = e.target.value;
    executePipeline();
  });
  
  // Sliders
  const cargoSlider = document.getElementById("cargoQuantitySlider");
  const cargoInput = document.getElementById("cargoQuantityInput");
  const cargoVal = document.getElementById("cargoQuantityVal");
  
  cargoSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.cargo_mt = val;
    cargoInput.value = val;
    cargoVal.innerText = `${(val / 1000).toFixed(0)}k MT`;
    executePipeline();
  });
  
  cargoInput.addEventListener("change", (e) => {
    const val = parseFloat(e.target.value);
    state.cargo_mt = val;
    cargoSlider.value = val;
    cargoVal.innerText = `${(val / 1000).toFixed(0)}k MT`;
    executePipeline();
  });
  
  const draftSlider = document.getElementById("vesselDraftSlider");
  const draftInput = document.getElementById("vesselDraftInput");
  const draftVal = document.getElementById("vesselDraftVal");
  
  draftSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.vessel_draft = val;
    draftInput.value = val;
    draftVal.innerText = `${val.toFixed(1)}m`;
    executePipeline();
  });
  
  draftInput.addEventListener("change", (e) => {
    const val = parseFloat(e.target.value);
    state.vessel_draft = val;
    draftSlider.value = val;
    draftVal.innerText = `${val.toFixed(1)}m`;
    executePipeline();
  });
  
  // Modal Buttons
  document.getElementById("openStockpileModalBtn").addEventListener("click", () => {
    if (state.stockpile) showStockpileModal(state.stockpile);
  });
  
  document.getElementById("openRiskModalBtn").addEventListener("click", () => {
    if (state.risk) showRiskModal(state.risk);
  });
  
  document.getElementById("openColoadModalBtn").addEventListener("click", () => {
    if (state.coload) showColoadModal(state.coload);
  });
  
  // Modal Closers
  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.style.display = "none");
    });
  });
  
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.style.display = "none";
    });
  });
  
  // Bootstrap with Scenario 1
  loadScenario(1);
});
