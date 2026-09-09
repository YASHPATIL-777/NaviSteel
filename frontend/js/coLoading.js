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
    <div style="background: var(--accent-primary-light); border: 1px solid #BAE6FD; border-radius: 10px; padding: 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.72rem; color: var(--accent-primary); text-transform: uppercase; font-weight: 700;">INTER-PSU BULK VESSEL SHARING SCANNER</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-navy-900);">Active Synergy Matches across SAIL, RINL, NMDC & Coal India</div>
      </div>
      <span class="badge badge-info">${coloadData.total_opportunities} ACTIVE LOTS</span>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
      ${coloadData.opportunities.map((opp, idx) => `
        <div style="background: ${idx === 0 ? '#F0F9FF' : '#FFFFFF'}; border: 1.5px solid ${idx === 0 ? 'var(--accent-primary)' : 'var(--border-color)'}; border-radius: 10px; padding: 1rem; position: relative; box-shadow: var(--shadow-xs);">
          ${idx === 0 ? '<div style="position: absolute; top: 10px; right: 10px;"><span class="badge badge-success">TOP SYNERGY MATCH</span></div>' : ''}
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 900; font-size: 0.95rem; color: var(--text-navy-900);">${opp.partner}</span>
            <span class="badge badge-info" style="font-size: 0.68rem;">${opp.psu_type}</span>
          </div>
          
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">
            Route: <strong style="color: var(--text-navy-900);">${opp.origin} ➔ ${opp.discharge_port}</strong> | Laycan: <strong style="color: var(--text-navy-900);">${opp.laycan_window}</strong>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem; font-size: 0.75rem;">
            <div>
              <span style="color: var(--text-muted); font-weight: 600;">Available Parcel:</span>
              <div style="font-family: var(--font-mono); font-weight: 800; color: var(--text-navy-900); font-size: 0.9rem; margin-top: 1px;">${opp.cargo_available_mt.toLocaleString()} MT</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-weight: 600;">Match Score:</span>
              <div style="font-family: var(--font-mono); font-weight: 800; color: #059669; font-size: 0.9rem; margin-top: 1px;">${opp.match_score}%</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-weight: 600;">Freight Savings:</span>
              <div style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary); font-size: 0.9rem; margin-top: 1px;">+$${opp.synergistic_savings_usd.toLocaleString()}</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-weight: 600;">CO₂ Avoidance:</span>
              <div style="font-family: var(--font-mono); font-weight: 800; color: #059669; font-size: 0.9rem; margin-top: 1px;">${opp.co2_reduction_mt} MT</div>
            </div>
          </div>
          
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 6px;">
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
