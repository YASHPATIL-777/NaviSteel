export function renderStockpileCard(stockpileData) {
  const benefitEl = document.getElementById("moduleANetBenefit");
  if (benefitEl) {
    benefitEl.innerText = `$${(stockpileData.net_strategic_benefit / 1e6).toFixed(2)}M`;
  }
  
  const recBadge = document.getElementById("moduleARecBadge");
  if (recBadge) {
    recBadge.innerText = stockpileData.recommendation_class.toUpperCase();
    recBadge.className = `badge ${stockpileData.recommendation_class === 'optimal' ? 'badge-success' : (stockpileData.recommendation_class === 'hold' ? 'badge-warning' : 'badge-danger')}`;
  }
}

export function showStockpileModal(stockpileData) {
  const modal = document.getElementById("stockpileModal");
  const modalBody = document.getElementById("stockpileModalBody");
  
  modalBody.innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">NET STRATEGIC STOCKPILING BENEFIT</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 800; color: #34D399;">+$${stockpileData.net_strategic_benefit.toLocaleString()}</div>
      </div>
      <span class="badge badge-success" style="font-size: 0.85rem; padding: 6px 12px;">${stockpileData.recommendation}</span>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 0.85rem; border-left: 3px solid #34D399;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #34D399; margin-bottom: 0.5rem;">STRATEGIC GROSS BENEFITS (+)</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>Avoided Price Spike:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">+$${stockpileData.avoided_price_spike.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>Avoided Monsoon Demurrage:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">+$${stockpileData.avoided_demurrage.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>Disruption Cushion:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #F8FAFC;">+$${stockpileData.disruption_cushion.toLocaleString()}</span>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 6px; padding-top: 4px; display: flex; justify-content: space-between; font-weight: 700; font-size: 0.85rem;">
          <span>Total Benefit:</span>
          <span style="font-family: var(--font-mono); color: #34D399;">+$${stockpileData.total_benefit.toLocaleString()}</span>
        </div>
      </div>
      
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 0.85rem; border-left: 3px solid #F87171;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #F87171; margin-bottom: 0.5rem;">CARRYING & CAPITAL COSTS (−)</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>Yard Storage (60d):</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #FCA5A5;">−$${stockpileData.storage_cost.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>Capital Carry (8.5% p.a. @ $${stockpileData.commodity_benchmark_price}/MT):</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #FCA5A5;">−$${stockpileData.capital_lockin_cost.toLocaleString()}</span>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 6px; padding-top: 4px; display: flex; justify-content: space-between; font-weight: 700; font-size: 0.85rem;">
          <span>Total Carrying Cost:</span>
          <span style="font-family: var(--font-mono); color: #F87171;">−$${stockpileData.total_carrying_cost.toLocaleString()}</span>
        </div>
      </div>
    </div>
    
    <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 0.85rem; font-size: 0.82rem; color: var(--text-secondary);">
      <strong>Economic Synthesis:</strong> ${stockpileData.breakdown_text}
    </div>
  `;
  
  modal.style.display = "flex";
}
