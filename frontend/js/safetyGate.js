export function renderSafetyGate(safetyData, onShowModal) {
  const gateBanner = document.getElementById("gate1Banner");
  const draftMarginVal = document.getElementById("draftMarginVal");
  const draftMarginSub = document.getElementById("draftMarginSub");
  const loaMarginVal = document.getElementById("loaMarginVal");
  const loaMarginSub = document.getElementById("loaMarginSub");
  const waveVal = document.getElementById("waveVal");
  const waveSub = document.getElementById("waveSub");
  const windVal = document.getElementById("windVal");
  const windSub = document.getElementById("windSub");
  
  if (safetyData.approved) {
    gateBanner.className = "gate1-banner approved";
    gateBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="pulse-dot"></span>
        <span>GATE 1: HYDRODYNAMIC & WEATHER SAFETY CLEARED</span>
      </div>
      <span class="badge badge-success">BERTHING PERMITTED</span>
    `;
  } else {
    gateBanner.className = "gate1-banner rejected";
    gateBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.1rem;">⚠️</span>
        <span>GATE 1: NO-GO // PHYSICAL SAFETY GATE REJECTED</span>
      </div>
      <button class="action-btn" id="viewRejectionDetailsBtn" style="width: auto; padding: 4px 12px; background: #DC2626; color: #FFFFFF; font-size: 0.72rem;">VIEW REJECTION DETAILS</button>
    `;
    
    setTimeout(() => {
      const btn = document.getElementById("viewRejectionDetailsBtn");
      if (btn) btn.onclick = () => onShowModal(safetyData);
    }, 50);
  }
  
  draftMarginVal.innerText = `${safetyData.draft_margin > 0 ? "+" : ""}${safetyData.draft_margin}m`;
  draftMarginSub.className = `telemetry-sub ${safetyData.draft_margin >= 0 ? "safe" : "danger"}`;
  draftMarginSub.innerText = safetyData.draft_margin >= 0 ? `Max: ${safetyData.max_draft}m (Safe)` : `EXCEEDS BY ${Math.abs(safetyData.draft_margin)}m`;
  
  loaMarginVal.innerText = `${safetyData.loa_margin > 0 ? "+" : ""}${safetyData.loa_margin}m`;
  loaMarginSub.className = `telemetry-sub ${safetyData.loa_margin >= 0 ? "safe" : "danger"}`;
  loaMarginSub.innerText = safetyData.loa_margin >= 0 ? `Max LOA: ${safetyData.max_loa}m` : `EXCEEDS BY ${Math.abs(safetyData.loa_margin)}m`;
  
  waveVal.innerText = `${safetyData.wave_height}m`;
  waveSub.className = `telemetry-sub ${safetyData.wave_safe ? "safe" : "danger"}`;
  waveSub.innerText = safetyData.wave_safe ? "Safe Swell (< 2.5m)" : "HIGH SWELL RISK";
  
  windVal.innerText = `${safetyData.wind_speed} km/h`;
  windSub.className = `telemetry-sub ${safetyData.wind_safe ? "safe" : "danger"}`;
  windSub.innerText = safetyData.wind_safe ? "Safe Gusts (< 40km/h)" : "HIGH WIND RISK";
}

export function showRejectionModal(safetyData) {
  const modal = document.getElementById("rejectionModal");
  const modalBody = document.getElementById("rejectionModalBody");
  
  let alternateListHtml = "";
  if (safetyData.alternate_ports && safetyData.alternate_ports.length > 0) {
    alternateListHtml = `
      <div style="margin-top: 1.25rem; background: var(--accent-primary-light); border: 1px solid #BAE6FD; border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 800; color: var(--accent-primary); margin-bottom: 0.5rem; font-size: 0.85rem;">RECOMMENDED DEEP-WATER ALTERNATIVE DISCHARGE PORTS:</div>
        <ul style="padding-left: 1.2rem; font-size: 0.82rem; color: var(--text-navy-800);">
          ${safetyData.alternate_ports.map(p => `
            <li style="margin-bottom: 4px;">
              <strong>${p.name}</strong> (${p.state}) — Max Permissible Draft: <strong>${p.max_draft}m</strong> | Max LOA: <strong>${p.max_loa}m</strong>. <em>${p.notes}</em>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  modalBody.innerHTML = `
    <div style="background: var(--accent-rose-light); border: 1.5px solid var(--accent-rose-border); border-radius: 8px; padding: 1.1rem; margin-bottom: 1rem;">
      <div style="font-weight: 900; color: #DC2626; font-size: 1rem; margin-bottom: 0.5rem;">🚨 CRITICAL PHYSICAL GATEWAY VIOLATION DETECTED</div>
      <p style="font-size: 0.85rem; color: var(--text-navy-900); margin-bottom: 0.5rem;">The requested charter does not satisfy Indian Ministry of Shipping & Port Authority physical clearance standards:</p>
      <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: #991B1B; font-weight: 600;">
        ${safetyData.reasons.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
      </ul>
    </div>
    <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
      <strong style="color: var(--text-navy-900);">Directives:</strong> Immediate vessel rejection logged. Downstream vessel recommendations and spot procurement authorizations are suspended until safe discharge port routing or lighterage operations are assigned.
    </div>
    ${alternateListHtml}
  `;
  
  modal.style.display = "flex";
}
