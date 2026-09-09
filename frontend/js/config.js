/**
 * NaviSteel Configuration Constants
 */
export const CONFIG = {
  API_BASE_URL: "http://127.0.0.1:8000/api",
  
  SCENARIOS: {
    1: {
      name: "Scenario 1: Australia ➔ Paradip (100k MT)",
      desc: "Standard long-haul coking coal for SAIL Rourkela/Bhilai. Panamax Best Fit.",
      origin: "Australia (Gladstone / Hay Point)",
      destination: "Paradip",
      cargo_type: "Coking Coal",
      cargo_mt: 100000,
      vessel_type: "Panamax",
      vessel_draft: 14.8,
      vessel_loa: 229.0
    },
    2: {
      name: "Scenario 2: Indonesia ➔ Vizag (50k MT)",
      desc: "Short-haul low-ash thermal coal for RINL. Supramax Best Fit.",
      origin: "Indonesia (Taboneo / Samarinda)",
      destination: "Visakhapatnam",
      cargo_type: "Thermal Coal",
      cargo_mt: 50000,
      vessel_type: "Supramax",
      vessel_draft: 12.8,
      vessel_loa: 199.0
    },
    3: {
      name: "Scenario 3: Australia ➔ Dhamra (150k MT)",
      desc: "Deep-water mega lot. Capesize Best Fit + Inter-PSU Co-Loading match.",
      origin: "Australia (Hay Point)",
      destination: "Dhamra",
      cargo_type: "Coking Coal",
      cargo_mt: 150000,
      vessel_type: "Capesize",
      vessel_draft: 17.5,
      vessel_loa: 292.0
    },
    4: {
      name: "Scenario 4: Unsafe Draft @ Vizag (120k MT)",
      desc: "Capesize (17.5m draft) into Vizag (14.5m max). Physical Safety Gate Rejection.",
      origin: "Australia (Gladstone)",
      destination: "Visakhapatnam",
      cargo_type: "Coking Coal",
      cargo_mt: 120000,
      vessel_type: "Capesize",
      vessel_draft: 17.5,
      vessel_loa: 292.0
    }
  },
  
  DEFAULT_PORTS: {
    "Paradip": { name: "Paradip Port", max_draft: 16.0, max_loa: 280 },
    "Dhamra": { name: "Dhamra Port", max_draft: 18.0, max_loa: 315 },
    "Visakhapatnam": { name: "Visakhapatnam Port", max_draft: 14.5, max_loa: 230 },
    "Gangavaram": { name: "Gangavaram Port", max_draft: 18.5, max_loa: 320 },
    "Gopalpur": { name: "Gopalpur Port", max_draft: 12.5, max_loa: 225 },
    "Haldia": { name: "Haldia Dock", max_draft: 8.5, max_loa: 190 },
    "Sagar": { name: "Sagar Anchorage", max_draft: 10.5, max_loa: 200 }
  }
};
