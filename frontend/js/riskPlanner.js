export function renderRiskCard(riskData) {
  const highlightEl = document.getElementById("moduleBRiskSummary");
  if (highlightEl) {
    highlightEl.innerText = `${riskData.highest_risk_month} (Peak Swell)`;
  }
}

export function showRiskModal(riskData) {
  const modal = document.getElementById("riskModal");
  const modalBody = document.getElementById("riskModalBody");
  
  const currentMonthIdx = 8; // September
  
  modalBody.innerHTML = `
    <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1rem;">
      Interactive 12-month multi-factor risk heatmap. Click any month tile to inspect monsoon swell surges, port siltation risks, and rake availability.
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.6rem; margin-bottom: 1.25rem;">
      ${riskData.months.map((m, idx) => {
        let bg = "var(--accent-emerald-light)";
        let border = "var(--accent-emerald-border)";
        let text = "#047857";
        if (m.risk_level === 'CRITICAL') {
          bg = "var(--accent-rose-light)";
          border = "var(--accent-rose-border)";
          text = "#B91C1C";
        } else if (m.risk_level === 'ELEVATED') {
          bg = "var(--accent-amber-light)";
          border = "var(--accent-amber-border)";
          text = "#B45309";
        } else if (m.risk_level === 'MODERATE') {
          bg = "#EFF6FF";
          border = "#BFDBFE";
          text = "#1D4ED8";
        }
        
        const isSelected = idx === currentMonthIdx;
        return `
          <div class="month-tile" id="monthTile_${idx}" data-idx="${idx}" style="background: ${bg}; border: 1.5px solid ${isSelected ? 'var(--accent-primary)' : border}; border-radius: 8px; padding: 0.6rem 0.4rem; text-align: center; cursor: pointer; transition: all 0.2s; ${isSelected ? 'box-shadow: 0 0 0 2px rgba(2,132,199,0.25);' : ''}">
            <div style="font-weight: 800; font-size: 0.82rem; color: var(--text-navy-900);">${m.month_name.slice(0,3)}</div>
            <div style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 800; color: ${text}; margin: 2px 0;">${m.risk_score}</div>
            <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${m.risk_level}</div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div id="monthDetailContainer" style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: 10px; padding: 1.15rem;">
      <!-- Populated dynamically -->
    </div>
  `;
  
  function updateMonthDetail(idx) {
    const m = riskData.months[idx];
    document.querySelectorAll('.month-tile').forEach(t => {
      const isCur = t.getAttribute('data-idx') === String(idx);
      t.style.borderColor = isCur ? 'var(--accent-primary)' : 'var(--border-color)';
      t.style.boxShadow = isCur ? '0 0 0 2px rgba(2,132,199,0.25)' : 'none';
    });
    
    const container = document.getElementById("monthDetailContainer");
    if (!container) return;
    
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.6rem; margin-bottom: 0.85rem;">
        <div>
          <span style="font-weight: 900; font-size: 1.05rem; color: var(--text-navy-900);">${m.month_name}</span>
          <span class="badge ${m.risk_level === 'CRITICAL' ? 'badge-danger' : (m.risk_level === 'ELEVATED' ? 'badge-warning' : 'badge-success')}" style="margin-left: 8px;">${m.risk_level} RISK (Score: ${m.risk_score}/100)</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Expected Delay: <strong style="color: var(--text-navy-900); font-family: var(--font-mono);">${m.delay_days} days</strong></div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 0.85rem;">
        <div style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Monsoon Factor</div>
          <div style="font-family: var(--font-mono); font-weight: 800; color: var(--text-navy-900); font-size: 1.1rem; margin-top: 2px;">${(m.monsoon_factor * 100).toFixed(0)}%</div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Cyclone Probability</div>
          <div style="font-family: var(--font-mono); font-weight: 800; color: var(--text-navy-900); font-size: 1.1rem; margin-top: 2px;">${(m.cyclone_factor * 100).toFixed(0)}%</div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Demurrage Exposure</div>
          <div style="font-family: var(--font-mono); font-weight: 800; color: #DC2626; font-size: 1.1rem; margin-top: 2px;">$${m.demurrage_exposure_usd.toLocaleString()}</div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Rake Availability</div>
          <div style="font-family: var(--font-mono); font-weight: 800; color: #059669; font-size: 1.1rem; margin-top: 2px;">${m.rake_availability_pct}%</div>
        </div>
      </div>
      
      <div style="font-size: 0.82rem; color: var(--text-navy-800); margin-bottom: 5px;">
        <strong>Hydrodynamic / Siltation Condition:</strong> <span style="color: var(--text-secondary);">${m.draft_risk}</span>
      </div>
      <div style="font-size: 0.82rem; color: var(--text-navy-800);">
        <strong>Procurement Directive:</strong> <span style="color: var(--accent-primary); font-weight: 700;">${m.recommended_action}</span>
      </div>
    `;
  }
  
  updateMonthDetail(currentMonthIdx);
  
  modal.querySelectorAll('.month-tile').forEach(tile => {
    tile.onclick = () => {
      const idx = parseInt(tile.getAttribute('data-idx'));
      updateMonthDetail(idx);
    };
  });
  
  modal.style.display = "flex";
}
