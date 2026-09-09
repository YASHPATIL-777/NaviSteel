export function renderContractPlanner(contractData) {
  const container = document.getElementById("contractPlannerContainer");
  const savingsBanner = document.getElementById("contractSavingsVal");
  const recBadge = document.getElementById("contractRecBadge");
  const rationaleList = document.getElementById("contractRationaleList");
  
  if (savingsBanner) {
    savingsBanner.innerText = `+$${(contractData.annual_savings_vs_spot / 1e6).toFixed(2)}M / Year`;
  }
  
  if (recBadge) {
    recBadge.innerText = contractData.recommended_strategy_name;
  }
  
  if (rationaleList && contractData.rationale) {
    rationaleList.innerHTML = contractData.rationale.map(r => `<li>${r}</li>`).join('');
  }
  
  if (!container || !contractData.options) return;
  
  container.innerHTML = contractData.options.map(opt => {
    let cardBorder = opt.is_recommended ? "var(--accent-primary)" : "var(--border-color)";
    let cardBg = opt.is_recommended ? "#F0F9FF" : "#FFFFFF";
    let riskBadgeClass = opt.operational_risk === "HIGH" ? "badge-danger" : (opt.operational_risk === "MEDIUM" ? "badge-warning" : "badge-success");
    
    return `
      <div style="background: ${cardBg}; border: 1.5px solid ${cardBorder}; border-radius: 10px; padding: 1.1rem; position: relative; display: flex; flex-direction: column; justify-content: space-between; box-shadow: ${opt.is_recommended ? '0 4px 14px rgba(2,132,199,0.12)' : 'var(--shadow-xs)'};">
        ${opt.is_recommended ? '<div style="position: absolute; top: -11px; right: 12px;"><span class="badge badge-success" style="font-size: 0.68rem; padding: 3px 8px; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">RECOMMENDED STRATEGY</span></div>' : ''}
        
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${opt.horizon_label}</div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--text-navy-900); margin: 3px 0 8px 0;">${opt.strategy_name}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; background: ${opt.is_recommended ? '#E0F2FE' : 'var(--bg-surface-subtle)'}; padding: 0.65rem; border-radius: 8px; border: 1px solid ${opt.is_recommended ? '#BAE6FD' : 'var(--border-subtle)'};">
            <div>
              <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">Contract Effective Rate</div>
              <div style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: var(--accent-primary);">$${opt.effective_rate_per_mt.toFixed(2)}<span style="font-size: 0.7rem; color: var(--text-muted);">/MT</span></div>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">Voyages Required</div>
              <div style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: var(--text-navy-900);">${opt.number_of_voyages} <span style="font-size: 0.7rem; color: var(--text-muted);">trips</span></div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">Total Spend (600k MT):</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-navy-900);">$${(opt.total_freight_spend_usd / 1e6).toFixed(2)}M</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">Savings vs Spot:</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: ${opt.expected_savings_vs_spot > 0 ? '#059669' : 'var(--text-muted)'};">${opt.expected_savings_vs_spot > 0 ? `+$${(opt.expected_savings_vs_spot / 1e6).toFixed(2)}M` : '$0 (Baseline)'}</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.65rem; margin-top: 0.75rem;">
          <span class="badge ${riskBadgeClass}">RISK: ${opt.operational_risk}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Flexibility: <strong style="color: var(--text-navy-800);">${opt.flexibility_score}%</strong></span>
        </div>
      </div>
    `;
  }).join('');
}
