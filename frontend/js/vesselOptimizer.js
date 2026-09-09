export function renderVesselOptimization(vesselData) {
  const tableBody = document.getElementById("vesselRankingTableBody");
  if (!tableBody) return;
  
  if (!vesselData.rankings || vesselData.rankings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No vessel data available.</td></tr>`;
    return;
  }
  
  tableBody.innerHTML = vesselData.rankings.map(v => {
    let rowClass = "";
    let rankBadge = `<span class="badge badge-info">#${v.rank}</span>`;
    let statusBadge = `<span class="badge badge-success">COMPLIANT</span>`;
    
    if (v.is_best_fit) {
      rowClass = "best-fit-row";
      rankBadge = `<span class="badge badge-success">#1 BEST FIT</span>`;
    } else if (!v.compliant) {
      rowClass = "rejected-row";
      rankBadge = `<span class="badge badge-danger">REJECTED</span>`;
      statusBadge = `<span class="badge badge-danger">${v.rejection_reason || 'UNSAFE'}</span>`;
    }
    
    return `
      <tr class="${rowClass}">
        <td>${rankBadge}</td>
        <td><strong>${v.vessel_type}</strong></td>
        <td>${(v.dwt_capacity / 1000).toFixed(0)}k DWT</td>
        <td>${v.draft}m / ${v.loa}m</td>
        <td>${v.compliant ? `${v.utilization_pct}%` : '—'}</td>
        <td>${v.compliant ? `${v.voyages_required} voyage${v.voyages_required > 1 ? 's' : ''}` : '—'}</td>
        <td>${v.compliant ? `$${v.freight_rate.toFixed(2)}/MT` : '—'}</td>
        <td>${v.compliant ? `<strong>$${(v.total_freight_usd / 1e6).toFixed(2)}M</strong>` : '—'}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}
