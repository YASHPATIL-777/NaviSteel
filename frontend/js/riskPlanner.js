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
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
      Interactive 12-month multi-factor risk heatmap. Click any month to inspect monsoon swell surges, port siltation risks, and rake availability.
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; margin-bottom: 1.25rem;">
      ${riskData.months.map((m, idx) => {
        let bg = "rgba(16, 185, 129, 0.15)";
        let border = "rgba(16, 185, 129, 0.3)";
        let text = "#34D399";
        if (m.risk_level === 'CRITICAL') {
          bg = "rgba(239, 68, 68, 0.25)";
          border = "rgba(239, 68, 68, 0.5)";
          text = "#F87171";
        } else if (m.risk_level === 'ELEVATED') {
          bg = "rgba(245, 158, 11, 0.2)";
          border = "rgba(245, 158, 11, 0.4)";
          text = "#FBBF24";
        } else if (m.risk_level === 'MODERATE') {
          bg = "rgba(56, 189, 248, 0.15)";
          border = "rgba(56, 189, 248, 0.3)";
          text = "#38BDF8";
        }
        
        const isSelected = idx === currentMonthIdx;
        return `
          <div class="month-tile" id="monthTile_${idx}" data-idx="${idx}" style="background: ${bg}; border: 1px solid ${isSelected ? 'var(--accent-cyan)' : border}; border-radius: 6px; padding: 0.5rem; text-align: center; cursor: pointer; transition: all 0.2s; ${isSelected ? 'box-shadow: 0 0 10px rgba(6,182,212,0.4);' : ''}">
            <div style="font-weight: 700; font-size: 0.78rem; color: #F8FAFC;">${m.month_name.slice(0,3)}</div>
            <div style="font-family: var(--font-mono); font-size: 0.95rem; font-weight: 800; color: ${text}; margin: 2px 0;">${m.risk_score}</div>
            <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">${m.risk_level}</div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div id="monthDetailContainer" style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
      <!-- Populated dynamically -->
    </div>
  `;
  
  function updateMonthDetail(idx) {
    const m = riskData.months[idx];
    document.querySelectorAll('.month-tile').forEach(t => {
      t.style.borderColor = (t.getAttribute('data-idx') === String(idx)) ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)';
      t.style.boxShadow = (t.getAttribute('data-idx') === String(idx)) ? '0 0 10px rgba(6,182,212,0.4)' : 'none';
    });
    
    const container = document.getElementById("monthDetailContainer");
    if (!container) return;
    
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
        <div>
          <span style="font-weight: 800; font-size: 1rem; color: #F8FAFC;">${m.month_name}</span>
          <span class="badge ${m.risk_level === 'CRITICAL' ? 'badge-danger' : (m.risk_level === 'ELEVATED' ? 'badge-warning' : 'badge-success')}" style="margin-left: 8px;">${m.risk_level} RISK (Score: ${m.risk_score}/100)</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Expected Delay: <strong style="color: #F8FAFC;">${m.delay_days} days</strong></div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin-bottom: 0.75rem;">
        <div style="background: rgba(30, 41, 59, 0.4); border-radius: 6px; padding: 0.5rem; text-align: center;">
          <div style="font-size: 0.65rem; color: var(--text-secondary);">Monsoon Factor</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">${(m.monsoon_factor * 100).toFixed(0)}%</div>
        </div>
        <div style="background: rgba(30, 41, 59, 0.4); border-radius: 6px; padding: 0.5rem; text-align: center;">
          <div style="font-size: 0.65rem; color: var(--text-secondary);">Cyclone Probability</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">${(m.cyclone_factor * 100).toFixed(0)}%</div>
        </div>
        <div style="background: rgba(30, 41, 59, 0.4); border-radius: 6px; padding: 0.5rem; text-align: center;">
          <div style="font-size: 0.65rem; color: var(--text-secondary);">Demurrage Exposure</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #F87171;">$${m.demurrage_exposure_usd.toLocaleString()}</div>
        </div>
        <div style="background: rgba(30, 41, 59, 0.4); border-radius: 6px; padding: 0.5rem; text-align: center;">
          <div style="font-size: 0.65rem; color: var(--text-secondary);">Rake Availability</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #34D399;">${m.rake_availability_pct}%</div>
        </div>
      </div>
      
      <div style="font-size: 0.82rem; color: var(--text-primary); margin-bottom: 4px;">
        <strong>Hydrodynamic / Siltation Condition:</strong> <span style="color: var(--text-secondary);">${m.draft_risk}</span>
      </div>
      <div style="font-size: 0.82rem; color: var(--text-primary);">
        <strong>Procurement Directive:</strong> <span style="color: var(--accent-cyan); font-weight: 600;">${m.recommended_action}</span>
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
