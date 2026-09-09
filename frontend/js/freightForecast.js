export function renderFreightForecast(forecastData) {
  document.getElementById("currentRateVal").innerText = `$${forecastData.current_rate.toFixed(2)}`;
  document.getElementById("forecast30dVal").innerText = `$${forecastData.forecast_30d.toFixed(2)}`;
  document.getElementById("forecast90dVal").innerText = `$${forecastData.forecast_90d.toFixed(2)}`;
  document.getElementById("forecast180dVal").innerText = `$${forecastData.forecast_180d.toFixed(2)}`;
  document.getElementById("forecast12mVal").innerText = `$${forecastData.forecast_12m.toFixed(2)}`;
  
  const trendEl = document.getElementById("forecastTrendBadge");
  trendEl.innerText = forecastData.trend;
  trendEl.className = `badge ${forecastData.trend === 'RISING' ? 'badge-danger' : (forecastData.trend === 'FALLING' ? 'badge-success' : 'badge-info')}`;
  
  document.getElementById("optimalWindowVal").innerText = forecastData.optimal_entry_window;
  document.getElementById("avoidedPremiumVal").innerText = `$${forecastData.avoided_premium.toLocaleString()}`;
  
  // Render SVG Forward Curve Chart
  renderCurveChart(forecastData);
}

function renderCurveChart(data) {
  const container = document.getElementById("forecastChartContainer");
  if (!container) return;
  
  const width = container.clientWidth || 550;
  const height = 185;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 18;
  const padBottom = 25;
  
  const allRates = [...data.historical_rates, ...data.forward_rates, ...data.upper_bounds, ...data.lower_bounds];
  const minRate = Math.min(...allRates) * 0.95;
  const maxRate = Math.max(...allRates) * 1.05;
  
  const allMonths = [...data.historical_months, ...data.forward_months.slice(1)];
  const totalPoints = allMonths.length;
  
  const getX = (idx) => padLeft + (idx / (totalPoints - 1)) * (width - padLeft - padRight);
  const getY = (val) => padTop + (1 - (val - minRate) / (maxRate - minRate)) * (height - padTop - padBottom);
  
  // Historical points
  const histPoints = data.historical_rates.map((r, i) => `${getX(i)},${getY(r)}`).join(" ");
  
  // Forward points start from last historical point (index 5)
  const fwdIndices = data.forward_rates.map((_, i) => 5 + i);
  const fwdPoints = data.forward_rates.map((r, i) => `${getX(5 + i)},${getY(r)}`).join(" ");
  
  // Confidence bounds polygon
  const upperPath = data.upper_bounds.map((r, i) => `${getX(5 + i)},${getY(r)}`);
  const lowerPath = data.lower_bounds.map((r, i) => `${getX(5 + i)},${getY(r)}`).reverse();
  const corridorPolygon = [...upperPath, ...lowerPath].join(" ");
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      <defs>
        <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0284C7" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      
      <!-- Grid lines -->
      <line x1="${padLeft}" y1="${getY(minRate)}" x2="${width - padRight}" y2="${getY(minRate)}" stroke="#E2E8F0" stroke-dasharray="3,3"/>
      <line x1="${padLeft}" y1="${getY((minRate + maxRate)/2)}" x2="${width - padRight}" y2="${getY((minRate + maxRate)/2)}" stroke="#E2E8F0" stroke-dasharray="3,3"/>
      <line x1="${padLeft}" y1="${getY(maxRate)}" x2="${width - padRight}" y2="${getY(maxRate)}" stroke="#E2E8F0" stroke-dasharray="3,3"/>
      
      <!-- Confidence Corridor -->
      <polygon points="${corridorPolygon}" fill="url(#corridorGrad)" />
      
      <!-- Historical Line -->
      <polyline points="${histPoints}" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,4"/>
      
      <!-- Forward Forecast Line -->
      <polyline points="${fwdPoints}" fill="none" stroke="#0284C7" stroke-width="2.5"/>
      
      <!-- Present Day Vertical Marker -->
      <line x1="${getX(5)}" y1="${padTop}" x2="${getX(5)}" y2="${height - padBottom}" stroke="#D97706" stroke-width="1.5" stroke-dasharray="2,2"/>
      <text x="${getX(5)}" y="${padTop - 4}" fill="#D97706" font-size="9" font-family="sans-serif" font-weight="700" text-anchor="middle">TODAY</text>
      
      <!-- Data circles -->
      ${data.forward_rates.map((r, i) => `
        <circle cx="${getX(5 + i)}" cy="${getY(r)}" r="${i === 2 ? 5 : 3.5}" fill="${i === 2 ? '#EF4444' : '#0284C7'}" stroke="#FFFFFF" stroke-width="2"/>
      `).join('')}
      
      <!-- Y-Axis labels -->
      <text x="${padLeft - 6}" y="${getY(maxRate) + 3}" fill="#64748B" font-size="9" font-family="monospace" font-weight="600" text-anchor="end">$${maxRate.toFixed(1)}</text>
      <text x="${padLeft - 6}" y="${getY((minRate + maxRate)/2) + 3}" fill="#64748B" font-size="9" font-family="monospace" font-weight="600" text-anchor="end">$${((minRate+maxRate)/2).toFixed(1)}</text>
      <text x="${padLeft - 6}" y="${getY(minRate) + 3}" fill="#64748B" font-size="9" font-family="monospace" font-weight="600" text-anchor="end">$${minRate.toFixed(1)}</text>
      
      <!-- X-Axis Key Labels -->
      <text x="${getX(0)}" y="${height - 6}" fill="#64748B" font-size="8.5" font-family="sans-serif">Apr 26</text>
      <text x="${getX(5)}" y="${height - 6}" fill="#D97706" font-size="8.5" font-family="sans-serif" font-weight="700" text-anchor="middle">Sep 26</text>
      <text x="${getX(7)}" y="${height - 6}" fill="#0284C7" font-size="8.5" font-family="sans-serif" font-weight="700" text-anchor="middle">Nov 26 (Peak)</text>
      <text x="${getX(totalPoints - 1)}" y="${height - 6}" fill="#64748B" font-size="8.5" font-family="sans-serif" text-anchor="end">Aug 27</text>
    </svg>
  `;
}
