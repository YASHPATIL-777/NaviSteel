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
    let border = idx === 0 ? "var(--accent-cyan)" : "rgba(255,255,255,0.08)";
    let bg = idx === 0 ? "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(15,23,42,0.8))" : "rgba(30,41,59,0.4)";
    let impactColor = alt.financial_type === "LOSS" ? "#F87171" : "#34D399";
    let impactPrefix = alt.financial_type === "LOSS" ? "" : "+";
    
    return `
      <div style="background: ${bg}; border: 1px solid ${border}; border-radius: 8px; padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 0.88rem; color: #F8FAFC;">${alt.title}</div>
            ${idx === 0 ? '<span class="badge badge-success" style="font-size: 0.65rem;">BEST FIT OPTION</span>' : ''}
          </div>
          
          <p style="font-size: 0.74rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.35;">
            ${alt.description}
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; background: rgba(15,23,42,0.5); padding: 0.5rem; border-radius: 6px; font-size: 0.72rem; margin-bottom: 8px;">
            <div>
              <span style="color: var(--text-secondary);">Idle Days:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">${alt.expected_idle_days}d <span style="color: #34D399; font-size: 0.65rem;">(-${alt.idle_reduction_days}d)</span></div>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Net Impact:</span>
              <div style="font-family: var(--font-mono); font-weight: 700; color: ${impactColor};">${impactPrefix}$${alt.financial_impact_usd.toLocaleString()}</div>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Deadheading:</span>
              <div style="font-family: var(--font-mono); font-weight: 600; color: #38BDF8; font-size: 0.68rem;">${alt.deadheading_risk}</div>
            </div>
          </div>
        </div>
        
        <button class="action-btn" style="font-size: 0.72rem; padding: 4px 8px; ${idx === 0 ? 'background: var(--accent-cyan); color: #050B14;' : 'background: rgba(30,41,59,0.6);'}">
          ${alt.action_label}
        </button>
      </div>
    `;
  }).join('');
}
