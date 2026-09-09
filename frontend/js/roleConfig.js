/**
 * NaviSteel Role-Based Operational Lens Configurations (SIH26006)
 * "One Intelligence Platform. Four Operational Lenses."
 */

export const ROLE_CONFIG = {
  charterer: {
    id: "charterer",
    name: "SAIL Charterer",
    roleCode: "SAIL / CHARTERER",
    clearance: "Tier 1 Charterer",
    defaultUser: "Yash Patil",
    badgeText: "Maritime Logistics Mission Control",
    heroTitle: "Global Steel. <br><span>Smarter Decisions.</span>",
    heroSubtitle: "AI-powered forward freight forecasting, multi-voyage contract planning, vessel positioning, and bulk procurement optimization for India's East Coast ports.",
    primaryCtaText: "START NEW ANALYSIS",
    primaryCtaHref: "#gatekeeperSection",
    secondaryCtaText: "LOAD SCENARIO 1 ▶",
    secondaryCtaScenario: 1,
    focusSectionId: "gatekeeperSection",
    sidebarNav: [
      { id: "heroSection", label: "Control Tower", icon: "compass" },
      { id: "gatekeeperSection", label: "Vessel Validation", icon: "shield" },
      { id: "forecastingSection", label: "Freight Intelligence", icon: "trending-up" },
      { id: "contractSection", label: "Contract Strategy", icon: "file-text" },
      { id: "alertsSection", label: "Risk & Alerts", icon: "alert-triangle" },
      { id: "idleSection", label: "Idle Management", icon: "clock" },
      { id: "modulesSection", label: "Stockpile & Co-Load", icon: "layers" },
      { id: "executiveDirectiveSection", label: "Executive Directive", icon: "check-circle" }
    ],
    kpis: [
      { key: "activeAnalyses", title: "Active Vessel Analyses", badge: "GLOBAL FLEET", defaultVal: "12", sub: "7 Ports Monitored", type: "global" },
      { key: "projectedImports", title: "Projected Imports", badge: "GLOBAL DEMAND", defaultVal: "3.2M", sub: "MT (H2 Target)", type: "global" },
      { key: "optimizedFreight", title: "Optimized Vessel Freight", badge: "CURRENT SCENARIO", defaultVal: "$14.20", sub: "Panamax Index", type: "scenario" },
      { key: "annualSavings", title: "Annual Charter Savings", badge: "CURRENT SCENARIO", defaultVal: "+$1.36M", sub: "vs Spot Benchmark", type: "scenario" },
      { key: "co2Mitigation", title: "CO₂ Mitigation", badge: "CO-LOAD SYNERGY", defaultVal: "340", sub: "MT CO₂ Avoided", type: "coload" },
      { key: "riskStatus", title: "Corridor Risk Status", badge: "CURRENT ROUTE", defaultVal: "73 / 100", sub: "Watch State", type: "risk" }
    ]
  },

  ministry: {
    id: "ministry",
    name: "Ministry Official",
    roleCode: "MINISTRY / OFFICIAL",
    clearance: "Apex Executive Clearance",
    defaultUser: "Dr. Rajesh Kumar",
    badgeText: "National Visibility & Resilience Mode",
    heroTitle: "National Steel Logistics <br><span>Command Center.</span>",
    heroSubtitle: "National visibility across steel raw-material flows, freight exposure, East Coast port resilience and inter-PSU coordination for Ministry of Steel.",
    primaryCtaText: "VIEW NATIONAL RISK →",
    primaryCtaHref: "#alertsSection",
    secondaryCtaText: "INSPECT SCENARIO 1 ▶",
    secondaryCtaScenario: 1,
    focusSectionId: "alertsSection",
    sidebarNav: [
      { id: "heroSection", label: "National Overview", icon: "globe" },
      { id: "gatekeeperSection", label: "Port Resilience", icon: "shield" },
      { id: "forecastingSection", label: "Freight Outlook", icon: "trending-up" },
      { id: "modulesSection", label: "PSU Coordination", icon: "users" },
      { id: "alertsSection", label: "Strategic Risk", icon: "alert-triangle" },
      { id: "executiveDirectiveSection", label: "Executive Directives", icon: "check-circle" }
    ],
    kpis: [
      { key: "projectedImports", title: "Projected National Imports", badge: "GLOBAL DEMAND", defaultVal: "3.2M", sub: "MT (H2 Target)", type: "global" },
      { key: "annualSavings", title: "National Logistics Savings", badge: "AGGREGATE", defaultVal: "+$1.36M", sub: "vs Spot Benchmark", type: "scenario" },
      { key: "portsMonitored", title: "East Coast Ports", badge: "MONITORED", defaultVal: "7", sub: "Active Steel Berths", type: "global" },
      { key: "co2Mitigation", title: "National CO₂ Abatement", badge: "PSU SYNERGY", defaultVal: "340", sub: "MT CO₂ Avoided", type: "coload" },
      { key: "riskStatus", title: "Strategic Corridor Risk", badge: "COMPOSITE", defaultVal: "73 / 100", sub: "Watch Level", type: "risk" },
      { key: "supplyResilience", title: "Supply Chain Resilience", badge: "OPERATIONAL", defaultVal: "94.8%", sub: "Berth Clearance Rate", type: "global" }
    ]
  },

  procurement: {
    id: "procurement",
    name: "Procurement Manager",
    roleCode: "PROCUREMENT / MANAGER",
    clearance: "Commercial Desk Lead",
    defaultUser: "A. K. Sharma",
    badgeText: "Raw Material Procurement Command",
    heroTitle: "Raw Material <br><span>Procurement Command.</span>",
    heroSubtitle: "Balance raw-material cargo demand, stockpile holding economics, multi-voyage contract exposure and delivered logistics cost across steel plants.",
    primaryCtaText: "CREATE PROCUREMENT PLAN →",
    primaryCtaHref: "#contractSection",
    secondaryCtaText: "INSPECT STOCKPILE ▶",
    secondaryCtaScenario: 1,
    focusSectionId: "contractSection",
    sidebarNav: [
      { id: "heroSection", label: "Procurement Command", icon: "compass" },
      { id: "gatekeeperSection", label: "Demand & Cargo", icon: "package" },
      { id: "forecastingSection", label: "Freight Outlook", icon: "trending-up" },
      { id: "contractSection", label: "Contract Strategy", icon: "file-text" },
      { id: "modulesSection", label: "Stockpile Engine", icon: "database" },
      { id: "alertsSection", label: "Supply Disruption", icon: "alert-triangle" },
      { id: "idleSection", label: "Co-Loading & Idle", icon: "users" },
      { id: "executiveDirectiveSection", label: "Procurement Directive", icon: "check-circle" }
    ],
    kpis: [
      { key: "annualDemand", title: "Annual Plant Demand", badge: "PLANT TARGET", defaultVal: "600k", sub: "MT Coking Coal", type: "scenario" },
      { key: "contractSavings", title: "Contract Savings", badge: "MULTI-VOYAGE", defaultVal: "+$1.36M", sub: "Short-Term COA", type: "scenario" },
      { key: "stockpileNet", title: "Stockpile Net Benefit", badge: "MODULE A", defaultVal: "+$610k", sub: "Pre-Monsoon Hedge", type: "stockpile" },
      { key: "forecastPeak", title: "Projected Freight Peak", badge: "Q3 FORECAST", defaultVal: "$16.80", sub: "Forward Curve", type: "forecast" },
      { key: "riskStatus", title: "Supply Risk Score", badge: "CORRIDOR", defaultVal: "73 / 100", sub: "Watch Level", type: "risk" },
      { key: "coloadSynergy", title: "Co-Load Synergy", badge: "INTER-PSU", defaultVal: "98% Match", sub: "SAIL IISCO Parcel", type: "coload" }
    ]
  },

  portAuthority: {
    id: "portAuthority",
    name: "Port Authority",
    roleCode: "PORT / AUTHORITY",
    clearance: "Harbour Master & Marine Ops",
    defaultUser: "Capt. V. Mukherjee",
    badgeText: "Port Operations & Hydrodynamic Safety Center",
    heroTitle: "Port Operations & <br><span>Safety Command.</span>",
    heroSubtitle: "Monitor vessel hydrodynamic compatibility, real-time draft/LOA envelopes, marine sea-state conditions, and East Coast berth congestion.",
    primaryCtaText: "RUN PORT SAFETY CHECK →",
    primaryCtaHref: "#gatekeeperSection",
    secondaryCtaText: "TEST SCENARIO 4 (SAFETY) ▶",
    secondaryCtaScenario: 4,
    focusSectionId: "gatekeeperSection",
    sidebarNav: [
      { id: "heroSection", label: "Port Operations", icon: "anchor" },
      { id: "gatekeeperSection", label: "Safety Gate (Gate 1)", icon: "shield" },
      { id: "forecastingSection", label: "Berth Turnaround", icon: "trending-up" },
      { id: "alertsSection", label: "Congestion & Swell", icon: "alert-triangle" },
      { id: "idleSection", label: "Vessel Queue", icon: "clock" },
      { id: "modulesSection", label: "Alternate Berths", icon: "navigation" },
      { id: "executiveDirectiveSection", label: "Safety Directive", icon: "check-circle" }
    ],
    kpis: [
      { key: "portsMonitored", title: "East Coast Terminals", badge: "BERTH ENVELOPE", defaultVal: "7", sub: "Deep-Water Berths", type: "global" },
      { key: "activeAnalyses", title: "Vessels in Corridor", badge: "TELEMETRY", defaultVal: "12", sub: "Active Tracks", type: "global" },
      { key: "currentWave", title: "Live Wave Height", badge: "OPEN-METEO", defaultVal: "1.4m", sub: "Safe Swell (< 2.5m)", type: "live" },
      { key: "currentWind", title: "Live Wind Velocity", badge: "OPEN-METEO", defaultVal: "24.8", sub: "km/h (< 40 km/h)", type: "live" },
      { key: "gateStatus", title: "Gate 1 Safety Status", badge: "HYDRODYNAMIC", defaultVal: "APPROVED", sub: "+1.5m Draft Margin", type: "safety" },
      { key: "riskStatus", title: "Berth Turnaround Risk", badge: "WEATHER & QUEUE", defaultVal: "73 / 100", sub: "September Watch", type: "risk" }
    ]
  }
};

/**
 * Mapping helper for icon SVGs
 */
export function getSidebarIconSvg(iconName) {
  switch (iconName) {
    case "compass":
    case "globe":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
    case "shield":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    case "trending-up":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`;
    case "file-text":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
    case "alert-triangle":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    case "clock":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    case "layers":
    case "database":
    case "package":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    case "check-circle":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    case "users":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
    case "anchor":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>`;
    case "navigation":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`;
    case "activity":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }
}
