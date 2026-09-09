export function renderExecutiveDecision(decisionData) {
  const statusBadge = document.getElementById("execStatusBadge");
  const vesselVal = document.getElementById("execVesselVal");
  const routeVal = document.getElementById("execRouteVal");
  const contractVal = document.getElementById("execContractVal");
  const savingsVal = document.getElementById("execSavingsVal");
  const annualSavingsVal = document.getElementById("execAnnualSavingsVal");
  const idleRiskVal = document.getElementById("execIdleRiskVal");
  const activeAlertVal = document.getElementById("execActiveAlertVal");
  const reasonsContainer = document.getElementById("execReasonsContainer");
  const reasonsList = document.getElementById("execReasonsList");
  const sigVal = document.getElementById("execSignatureVal");
  
  if (decisionData.is_approved) {
    statusBadge.className = "exec-status-badge go";
    statusBadge.innerText = decisionData.status_label;
    reasonsContainer.className = "exec-reasons";
  } else {
    statusBadge.className = "exec-status-badge nogo";
    statusBadge.innerText = decisionData.status_label;
    reasonsContainer.className = "exec-reasons danger";
  }
  
  if (vesselVal) vesselVal.innerText = decisionData.recommended_vessel;
  if (routeVal) routeVal.innerText = decisionData.route;
  if (contractVal) contractVal.innerText = decisionData.contract_type;
  if (savingsVal) savingsVal.innerText = decisionData.estimated_savings;
  if (annualSavingsVal) annualSavingsVal.innerText = decisionData.annual_contract_savings;
  if (idleRiskVal) idleRiskVal.innerText = decisionData.idle_risk;
  if (activeAlertVal) activeAlertVal.innerText = decisionData.active_alert_summary;
  if (sigVal) sigVal.innerText = decisionData.digital_signature;
  
  if (reasonsList && decisionData.reasons) {
    reasonsList.innerHTML = decisionData.reasons.map(r => `<li>${r}</li>`).join('');
  }
}
