import { CONFIG } from './config.js';

async function postJSON(endpoint, data) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status} on ${endpoint}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`Fetch failed on ${endpoint}:`, err);
    throw err;
  }
}

async function getJSON(endpoint) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error ${response.status} on ${endpoint}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`Fetch failed on ${endpoint}:`, err);
    throw err;
  }
}

export const API = {
  checkSafety: (payload) => postJSON("/safety/check", payload),
  getForecast: (payload) => postJSON("/freight/forecast", payload),
  optimizeVessels: (payload) => postJSON("/vessels/optimize", payload),
  planContracts: (payload) => postJSON("/contracts/plan", payload),
  getAlerts: (payload) => postJSON("/alerts/evaluate", payload),
  getStockpileStrategy: (payload) => postJSON("/strategy/stockpile", payload),
  getIdleStrategy: (payload) => postJSON("/strategy/idle", payload),
  getRiskMatrix: (destination) => postJSON("/strategy/risk", { destination }),
  getColoadingMatches: (payload) => postJSON("/strategy/coload", payload),
  getExecutiveDecision: (payload) => postJSON("/decision", payload),
  getPortWeather: (port) => getJSON(`/weather/${encodeURIComponent(port)}`),
  getAISVesselTelemetry: (identifier = "9412345") => getJSON(`/ais/vessel/${encodeURIComponent(identifier)}`)
};

