export function renderColoadCard(coloadData) {
  const savingsEl = document.getElementById("moduleCSavings");
  const partnerBadge = document.getElementById("moduleCPartnerBadge");
  const co2Badge = document.getElementById("moduleCCo2Badge");
  
  if (coloadData.best_match) {
    if (savingsEl) {
      savingsEl.innerText = `+$${(coloadData.best_match.synergistic_savings_usd / 1000).toFixed(0)}k`;
    }
    if (partnerBadge) {
      const p = coloadData.best_match.partner;
      const shortName = p.includes("SAIL") ? "SAIL MATCH" : (p.includes("RINL") ? "RINL MATCH" : (p.includes("NMDC") ? "NMDC MATCH" : "PSU MATCH"));
      partnerBadge.innerText = `${shortName} (${coloadData.best_match.match_score}%)`;
    }
    if (co2Badge) {
      co2Badge.innerText = `-${coloadData.best_match.co2_reduction_mt} MT CO₂`;
    }
  }
}

export function showColoadModal(coloadData) {
  const modal = document.getElementById("coloadModal");
  const modalBody = document.getElementById("coloadModalBody");
  
  modalBody.innerHTML = `
    <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid var(--accent-cyan); border-radius: 8px; padding: 0.85rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">INTER-PSU BULK VESSEL SHARING SCANNER</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: #F8FAFC;">Active Matches across SAIL, RINL, NMDC & Coal India</div>
      </div>
      <span class="badge badge-info">${coloadData.total_opportunities} ACTIVE LOTS</span>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${coloadData.opportunities.map((opp, idx) => `
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid ${idx === 0 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 0.85rem; position: relative;">
          ${idx === 0 ? '<div style="position: absolute; top: 8px; right: 8px;"><span class="badge badge-success">TOP SYNERGY MATCH</span></div>' : ''}
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 0.9rem; color: #F8FAFC;">${opp.partner}</span>
            <span class="badge badge-info" style="font-size: 0.68rem;">${opp.psu_type}</span>
          </div>
          
          <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 8px;">
            Route: <strong style="color: #F8FAFC;">${opp.origin} ➔ ${opp.discharge_port}</strong> | Laycan: <strong style="color: #F8FAFC;">${opp.laycan_window}</strong>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; background: rgba(15, 23, 42, 0.6); border-radius: 6px; padding: 0.5rem; font-size: 0.75rem;">
            <div>
              <span style="color: var(--text-secondary);">Available Parcel:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">${opp.cargo_available_mt.toLocaleString()} MT</div>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Match Compatibility:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #34D399;">${opp.match_score}%</div>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Freight Savings:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #38BDF8;">+$${opp.synergistic_savings_usd.toLocaleString()}</div>
            </div>
            <div>
              <span style="color: var(--text-secondary);">CO₂ Avoidance:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #10B981;">${opp.co2_reduction_mt} MT CO₂</div>
            </div>
          </div>
          
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">
            <em>${opp.notes}</em>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-top: 1rem; font-size: 0.72rem; color: var(--text-muted); text-align: center;">
      ${coloadData.disclaimer}
    </div>
  `;
  
  modal.style.display = "flex";
}
