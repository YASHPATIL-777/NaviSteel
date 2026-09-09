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
    <div style="background: var(--accent-emerald-light); border: 1px solid var(--accent-emerald-border); border-radius: 10px; padding: 1.1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.72rem; color: #047857; text-transform: uppercase; font-weight: 700;">NET STRATEGIC STOCKPILING BENEFIT</div>
        <div style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 800; color: #065F46;">+$${stockpileData.net_strategic_benefit.toLocaleString()}</div>
      </div>
      <span class="badge badge-success" style="font-size: 0.85rem; padding: 6px 14px;">${stockpileData.recommendation}</span>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
      <div style="background: var(--bg-surface-subtle); border-radius: 8px; padding: 1rem; border-left: 4px solid #059669; border: 1px solid var(--border-subtle); border-left-width: 4px;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #047857; margin-bottom: 0.65rem;">STRATEGIC GROSS BENEFITS (+)</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 5px;">
          <span style="color: var(--text-secondary);">Avoided Price Spike:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-navy-900);">+$${stockpileData.avoided_price_spike.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 5px;">
          <span style="color: var(--text-secondary);">Avoided Monsoon Demurrage:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-navy-900);">+$${stockpileData.avoided_demurrage.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 5px;">
          <span style="color: var(--text-secondary);">Disruption Cushion:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-navy-900);">+$${stockpileData.disruption_cushion.toLocaleString()}</span>
        </div>
        <div style="border-top: 1px solid var(--border-color); margin-top: 8px; padding-top: 6px; display: flex; justify-content: space-between; font-weight: 800; font-size: 0.88rem;">
          <span style="color: var(--text-navy-900);">Total Gross Benefit:</span>
          <span style="font-family: var(--font-mono); color: #059669;">+$${stockpileData.total_benefit.toLocaleString()}</span>
        </div>
      </div>
      
      <div style="background: var(--bg-surface-subtle); border-radius: 8px; padding: 1rem; border-left: 4px solid #DC2626; border: 1px solid var(--border-subtle); border-left-width: 4px;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #991B1B; margin-bottom: 0.65rem;">CARRYING & CAPITAL COSTS (−)</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 5px;">
          <span style="color: var(--text-secondary);">Yard Storage (60d):</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #DC2626;">−$${stockpileData.storage_cost.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 5px;">
          <span style="color: var(--text-secondary);">Capital Carry (8.5% p.a. @ $${stockpileData.commodity_benchmark_price}/MT):</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #DC2626;">−$${stockpileData.capital_lockin_cost.toLocaleString()}</span>
        </div>
        <div style="border-top: 1px solid var(--border-color); margin-top: 8px; padding-top: 6px; display: flex; justify-content: space-between; font-weight: 800; font-size: 0.88rem;">
          <span style="color: var(--text-navy-900);">Total Carrying Cost:</span>
          <span style="font-family: var(--font-mono); color: #DC2626;">−$${stockpileData.total_carrying_cost.toLocaleString()}</span>
        </div>
      </div>
    </div>
    
    <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.95rem; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
      <strong style="color: var(--text-navy-900);">Economic Synthesis:</strong> ${stockpileData.breakdown_text}
    </div>
  `;
  
  modal.style.display = "flex";
}
