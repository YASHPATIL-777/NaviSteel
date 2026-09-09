export function renderDisruptionAlerts(alertData) {
  const scoreVal = document.getElementById("alertCompositeScoreVal");
  const scoreBadge = document.getElementById("alertRiskLevelBadge");
  const container = document.getElementById("disruptionAlertsList");
  
  if (scoreVal) {
    scoreVal.innerText = `${alertData.composite_risk_score}/100`;
  }
  
  if (scoreBadge) {
    scoreBadge.innerText = `${alertData.risk_level} RISK`;
    scoreBadge.className = `badge ${alertData.risk_level === 'CRITICAL' ? 'badge-danger' : (alertData.risk_level === 'HIGH' ? 'badge-warning' : 'badge-info')}`;
  }
  
  if (!container || !alertData.alerts) return;
  
  container.innerHTML = alertData.alerts.map(a => {
    let sevClass = a.severity === 'CRITICAL' ? 'badge-danger' : (a.severity === 'HIGH' ? 'badge-warning' : 'badge-info');
    let border = a.severity === 'CRITICAL' ? 'var(--accent-rose)' : (a.severity === 'HIGH' ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)');
    
    return `
      <div style="background: rgba(30, 41, 59, 0.5); border-left: 3px solid ${border}; border-radius: 6px; padding: 0.75rem; display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.85rem; color: #F8FAFC;">${a.title}</div>
          <span class="badge ${sevClass}" style="font-size: 0.65rem;">${a.severity}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-secondary);">
          <span>Route: <strong style="color: #F8FAFC;">${a.route}</strong></span>
          <span>Probability: <strong style="color: #FBBF24;">${a.probability_pct}%</strong> | Exposure: <strong style="color: #F87171;">$${a.estimated_exposure_usd.toLocaleString()}</strong></span>
        </div>
        
        <div style="background: rgba(15,23,42,0.6); padding: 0.45rem 0.6rem; border-radius: 4px; font-size: 0.72rem; margin-top: 4px; color: var(--accent-cyan); display: flex; align-items: center; gap: 6px;">
          <span style="font-weight: 800;">DIRECTIVE:</span>
          <span>${a.recommended_action}</span>
        </div>
      </div>
    `;
  }).join('');
}
