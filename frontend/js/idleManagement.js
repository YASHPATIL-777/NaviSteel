export function renderIdleManagement(idleData) {
  const lossEl = document.getElementById("idleBaselineLossVal");
  const daysEl = document.getElementById("idleBaselineDaysVal");
  const recBadge = document.getElementById("idleRecBadge");
  const container = document.getElementById("idleAlternativesContainer");
  
  if (lossEl) {
    lossEl.innerText = `-$${(idleData.baseline_idle_loss_usd / 1000).toFixed(0)}k`;
  }
  if (daysEl) {
    daysEl.innerText = `${idleData.baseline_idle_days} Days / Voyage`;
  }
  if (recBadge) {
    recBadge.innerText = idleData.recommended_action;
  }
  
  if (!container || !idleData.alternatives) return;
  
  container.innerHTML = idleData.alternatives.map((alt, idx) => {
    let border = idx === 0 ? "var(--accent-primary)" : "var(--border-color)";
    let bg = idx === 0 ? "#F0F9FF" : "#FFFFFF";
    let impactColor = alt.financial_type === "LOSS" ? "#DC2626" : "#059669";
    let impactPrefix = alt.financial_type === "LOSS" ? "" : "+";
    
    return `
      <div style="background: ${bg}; border: 1.5px solid ${border}; border-radius: 9px; padding: 0.95rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-xs);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-navy-900);">${alt.title}</div>
            ${idx === 0 ? '<span class="badge badge-success" style="font-size: 0.65rem;">BEST FIT OPTION</span>' : ''}
          </div>
          
          <p style="font-size: 0.74rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.35;">
            ${alt.description}
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; background: ${idx === 0 ? '#E0F2FE' : 'var(--bg-surface-subtle)'}; padding: 0.55rem; border-radius: 6px; font-size: 0.72rem; margin-bottom: 8px; border: 1px solid var(--border-subtle);">
            <div>
              <span style="color: var(--text-muted);">Idle Days:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-navy-900);">${alt.expected_idle_days}d <span style="color: #059669; font-size: 0.65rem;">(-${alt.idle_reduction_days}d)</span></div>
            </div>
            <div>
              <span style="color: var(--text-muted);">Net Impact:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: ${impactColor};">${impactPrefix}$${alt.financial_impact_usd.toLocaleString()}</div>
            </div>
            <div>
              <span style="color: var(--text-muted);">Deadheading:</span>
              <div style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-primary); font-size: 0.68rem;">${alt.deadheading_risk}</div>
            </div>
          </div>
        </div>
        
        <button class="action-btn" style="font-size: 0.72rem; padding: 5px 8px; ${idx === 0 ? 'background: var(--accent-primary);' : 'background: #FFFFFF; color: var(--text-navy-800); border: 1px solid var(--border-color); box-shadow: none;'}">
          ${alt.action_label}
        </button>
      </div>
    `;
  }).join('');
}
