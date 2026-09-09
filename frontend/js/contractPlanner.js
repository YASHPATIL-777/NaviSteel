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
    let cardBorder = opt.is_recommended ? "var(--accent-cyan)" : "rgba(255,255,255,0.08)";
    let cardBg = opt.is_recommended ? "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(15,23,42,0.85))" : "rgba(30,41,59,0.4)";
    let riskBadgeClass = opt.operational_risk === "HIGH" ? "badge-danger" : (opt.operational_risk === "MEDIUM" ? "badge-warning" : "badge-success");
    
    return `
      <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; padding: 1rem; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        ${opt.is_recommended ? '<div style="position: absolute; top: -10px; right: 12px;"><span class="badge badge-success" style="font-size: 0.72rem; padding: 3px 8px; box-shadow: 0 0 10px rgba(16,185,129,0.5);">RECOMMENDED STRATEGY</span></div>' : ''}
        
        <div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">${opt.horizon_label}</div>
          <div style="font-size: 1rem; font-weight: 800; color: #F8FAFC; margin: 4px 0 8px 0;">${opt.strategy_name}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; background: rgba(15,23,42,0.5); padding: 0.6rem; border-radius: 6px;">
            <div>
              <div style="font-size: 0.68rem; color: var(--text-secondary);">Effective Rate</div>
              <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: #38BDF8;">$${opt.effective_rate_per_mt.toFixed(2)}<span style="font-size: 0.7rem; color: var(--text-secondary);">/MT</span></div>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--text-secondary);">Voyages Required</div>
              <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: #F8FAFC;">${opt.number_of_voyages} <span style="font-size: 0.7rem; color: var(--text-secondary);">trips</span></div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">Total Spend (600k MT):</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">$${(opt.total_freight_spend_usd / 1e6).toFixed(2)}M</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">Savings vs Spot:</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: ${opt.expected_savings_vs_spot > 0 ? '#34D399' : 'var(--text-muted)'};">${opt.expected_savings_vs_spot > 0 ? `+$${(opt.expected_savings_vs_spot / 1e6).toFixed(2)}M` : '$0 (Baseline)'}</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.6rem; margin-top: 0.75rem;">
          <span class="badge ${riskBadgeClass}">RISK: ${opt.operational_risk}</span>
          <span style="font-size: 0.72rem; color: var(--text-secondary);">Flexibility: <strong style="color: #F8FAFC;">${opt.flexibility_score}%</strong></span>
        </div>
      </div>
    `;
  }).join('');
}
