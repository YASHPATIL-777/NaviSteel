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
    let border = a.severity === 'CRITICAL' ? 'var(--accent-rose)' : (a.severity === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-primary)');
    let bg = a.severity === 'CRITICAL' ? '#FEF2F2' : (a.severity === 'HIGH' ? '#FFFBEB' : '#F0F9FF');
    
    return `
      <div style="background: ${bg}; border: 1px solid var(--border-color); border-left: 4px solid ${border}; border-radius: 8px; padding: 0.85rem; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--shadow-xs);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-navy-900);">${a.title}</div>
          <span class="badge ${sevClass}" style="font-size: 0.65rem;">${a.severity}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--text-secondary);">
          <span>Route: <strong style="color: var(--text-navy-800);">${a.route}</strong></span>
          <span>Probability: <strong style="color: #D97706;">${a.probability_pct}%</strong> | Exposure: <strong style="color: #DC2626;">$${a.estimated_exposure_usd.toLocaleString()}</strong></span>
        </div>
        
        <div style="background: #FFFFFF; border: 1px solid var(--border-color); padding: 0.5rem 0.65rem; border-radius: 6px; font-size: 0.74rem; margin-top: 4px; color: var(--accent-primary); display: flex; align-items: center; gap: 6px;">
          <span style="font-weight: 800; color: var(--text-navy-900);">DIRECTIVE:</span>
          <span style="font-weight: 600;">${a.recommended_action}</span>
        </div>
      </div>
    `;
  }).join('');
}
