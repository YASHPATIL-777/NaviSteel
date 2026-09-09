/**
 * NaviSteel Cinematic Maritime Motion & Physics Engine (SIH26006)
 * "A living ocean intelligence command center."
 */

let globalOceanController = null;

/**
 * 1. Living Ocean Harmonic Wave & Telemetry Particle Simulation (HTML5 Canvas)
 */
export function initLivingOcean(canvasId = "oceanCanvas") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReducedMotion) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "rgba(2, 132, 199, 0.15)");
    grad.addColorStop(1, "rgba(15, 23, 42, 0.95)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Active risk mode: "normal", "watch", "critical"
  let currentRiskMode = "normal";

  // 4 Layered Harmonic Ocean Waves
  const waves = [
    { length: 0.0032, amplitude: 24, speed: 0.012, color: "rgba(14, 165, 233, 0.25)", crestColor: "rgba(56, 189, 248, 0.55)", yOffset: height * 0.62 },
    { length: 0.0055, amplitude: 18, speed: 0.018, color: "rgba(2, 132, 199, 0.32)", crestColor: "rgba(125, 211, 252, 0.65)", yOffset: height * 0.70 },
    { length: 0.0085, amplitude: 14, speed: 0.025, color: "rgba(3, 105, 161, 0.45)", crestColor: "rgba(186, 230, 253, 0.75)", yOffset: height * 0.78 },
    { length: 0.0130, amplitude: 10, speed: 0.034, color: "rgba(5, 28, 60, 0.75)",  crestColor: "rgba(255, 255, 255, 0.55)",  yOffset: height * 0.86 }
  ];

  // Bioluminescent Maritime Telemetry Floating Particles
  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.95,
    size: Math.random() * 2.2 + 0.8,
    speedX: (Math.random() - 0.5) * 0.4 - 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.6 + 0.2,
    pulseSpeed: Math.random() * 0.03 + 0.01
  }));

  let step = 0;
  let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5, rippleStrength: 0 };

  // Cursor Ripple Interaction
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.rippleStrength = 1.0;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    waves[0].yOffset = height * 0.58;
    waves[1].yOffset = height * 0.68;
    waves[2].yOffset = height * 0.78;
    waves[3].yOffset = height * 0.88;
  }, { passive: true });

  let animationFrameId = null;

  function render() {
    ctx.clearRect(0, 0, width, height);
    step += currentRiskMode === "critical" ? 0.032 : (currentRiskMode === "watch" ? 0.024 : 0.018);

    // Smooth cursor interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    mouse.rippleStrength *= 0.95;

    // Atmospheric Risk Atmosphere
    if (currentRiskMode === "critical") {
      const gradAlert = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 350);
      gradAlert.addColorStop(0, "rgba(220, 38, 38, 0.08)");
      gradAlert.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradAlert;
      ctx.fillRect(0, 0, width, height);
    }

    // 1. Render Bioluminescent Maritime Telemetry Particles
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const pulsatingAlpha = p.alpha * (0.6 + 0.4 * Math.sin(step * p.pulseSpeed * 60));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = currentRiskMode === "critical" 
        ? `rgba(239, 68, 68, ${pulsatingAlpha})` 
        : `rgba(56, 189, 248, ${pulsatingAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = currentRiskMode === "critical" ? "#EF4444" : "#38BDF8";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 2. Render Layered Waves with Foam Crests
    waves.forEach((w, layerIdx) => {
      ctx.beginPath();
      ctx.moveTo(0, height);

      const points = [];
      const ampMultiplier = currentRiskMode === "critical" ? 1.5 : (currentRiskMode === "watch" ? 1.2 : 1.0);

      for (let x = 0; x <= width; x += 10) {
        let y = Math.sin(x * w.length + step * (layerIdx + 1) * 0.55) * (w.amplitude * ampMultiplier);
        y += Math.cos(x * w.length * 0.6 + step * 0.35) * (w.amplitude * 0.45 * ampMultiplier);

        // Localized Cursor Ripple
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        if (dist < 220) {
          const rippleFactor = (1 - dist / 220) * mouse.rippleStrength * 22;
          y += Math.sin(dist * 0.08 - step * 4) * rippleFactor;
        }

        const waveY = w.yOffset + y;
        points.push({ x, y: waveY });
        ctx.lineTo(x, waveY);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      if (currentRiskMode === "critical") {
        ctx.fillStyle = layerIdx === 3 ? "rgba(35, 10, 20, 0.85)" : `rgba(180, 30, 45, ${0.12 + layerIdx * 0.08})`;
      } else {
        ctx.fillStyle = w.color;
      }
      ctx.fill();

      // Render Wave Crest Highlights
      ctx.beginPath();
      points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = currentRiskMode === "critical" ? "rgba(248, 113, 113, 0.7)" : w.crestColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  globalOceanController = {
    setRiskMode: (mode) => {
      currentRiskMode = mode;
    },
    stop: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }
  };

  return globalOceanController;
}

/**
 * Update Living Ocean Environmental State
 */
export function setOceanRiskState(mode = "normal") {
  if (globalOceanController && globalOceanController.setRiskMode) {
    globalOceanController.setRiskMode(mode);
  }
}

/**
 * 2. High-Precision Easing Number Counter
 */
export function animateCounter(element, targetVal, duration = 800, prefix = "", suffix = "", decimals = 0) {
  if (!element) return;
  if (typeof targetVal !== "number" || isNaN(targetVal)) {
    element.innerText = `${prefix}${targetVal}${suffix}`;
    return;
  }

  const startVal = parseFloat(element.getAttribute("data-current-val")) || 0;
  element.setAttribute("data-current-val", targetVal);
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1.0);
    const easeOut = 1 - Math.pow(1 - progress, 5);
    const current = startVal + (targetVal - startVal) * easeOut;

    element.innerText = `${prefix}${current.toFixed(decimals)}${suffix}`;

    if (progress < 1.0) {
      requestAnimationFrame(update);
    } else {
      element.innerText = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/**
 * 3. Live 7-Stage Decision Pipeline Tracker
 */
export function updateDecisionPipeline(stepIndex = 1, isApproved = true) {
  const progressBar = document.getElementById("pipelineProgressBar");
  const nodes = document.querySelectorAll(".pipeline-node");
  if (!nodes || nodes.length === 0) return;

  const percentages = [0, 16.6, 33.3, 50, 66.6, 83.3, 100];
  const targetPct = percentages[Math.min(stepIndex, percentages.length - 1)];

  if (progressBar) {
    progressBar.style.width = `${targetPct}%`;
  }

  nodes.forEach((node, idx) => {
    node.classList.remove("active", "completed", "rejected");
    if (idx < stepIndex) {
      node.classList.add("completed");
    } else if (idx === stepIndex) {
      if (!isApproved && idx === 1) {
        node.classList.add("rejected");
      } else {
        node.classList.add("active");
      }
    }
  });
}

/**
 * 4. Scenario Transition Wave Sweep
 */
export function triggerScenarioSweep() {
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    mainContainer.classList.remove("scenario-wave-sweep");
    void mainContainer.offsetWidth;
    mainContainer.classList.add("scenario-wave-sweep");
  }
}

/**
 * 5. Master Executive Decision Verdict Motion
 */
export function triggerDecisionVerdictMotion(isApproved = true) {
  const directiveCard = document.querySelector(".directive-card");
  if (!directiveCard) return;

  directiveCard.classList.remove("decision-go-active", "decision-nogo-active");
  void directiveCard.offsetWidth;

  if (isApproved) {
    directiveCard.classList.add("decision-go-active");
  } else {
    directiveCard.classList.add("decision-nogo-active");
  }
}

/**
 * 6. NAVI AI Orbital Core Processing States with 4 Satellites (FREIGHT, WEATHER, VESSEL, RISK)
 */
export function updateNaviAiState(state = "idle") {
  const heroAiContainer = document.getElementById("heroNaviAiContainer");
  const gem = document.querySelector(".navi-core-center-gem") || document.querySelector(".orbital-center-gem");
  const ring1 = document.querySelector(".navi-orbital-track-1") || document.querySelector(".orbital-ring-1");
  const ring2 = document.querySelector(".navi-orbital-track-2") || document.querySelector(".orbital-ring-2");
  const stateLabel = document.getElementById("heroNaviStateLabel");

  if (heroAiContainer) {
    heroAiContainer.classList.remove("state-evaluating", "state-ready", "state-rejected", "state-optimizing");
    heroAiContainer.classList.add(`state-${state}`);
  }

  if (stateLabel) {
    switch (state) {
      case "evaluating": stateLabel.innerText = "EVALUATING MULTI-VOYAGE RISK"; break;
      case "rejected": stateLabel.innerText = "CRITICAL SAFETY LOCKOUT"; break;
      case "ready": stateLabel.innerText = "GREEN CLEARANCE VERIFIED"; break;
      case "optimizing": stateLabel.innerText = "OPTIMIZING CHARTER ECONOMICS"; break;
      default: stateLabel.innerText = "ACTIVE INTELLIGENCE SATELLITE"; break;
    }
  }

  // Ocean Environment Coupling
  if (state === "rejected") {
    setOceanRiskState("critical");
  } else if (state === "evaluating") {
    setOceanRiskState("watch");
  } else {
    setOceanRiskState("normal");
  }

  if (!gem) return;

  switch (state) {
    case "evaluating":
      if (ring1) ring1.style.animationDuration = "2.0s";
      if (ring2) ring2.style.animationDuration = "1.2s";
      gem.style.boxShadow = "0 0 16px #38BDF8, 0 0 28px #0284C7";
      break;
    case "rejected":
      if (ring1) ring1.style.borderColor = "rgba(239, 68, 68, 0.8)";
      if (ring2) ring2.style.borderTopColor = "#EF4444";
      gem.style.background = "radial-gradient(circle, #EF4444 0%, #B91C1C 100%)";
      gem.style.boxShadow = "0 0 16px #EF4444, 0 0 28px rgba(185, 28, 28, 0.8)";
      break;
    case "optimized":
    case "ready":
      if (ring1) {
        ring1.style.animationDuration = "8s";
        ring1.style.borderColor = "rgba(16, 185, 129, 0.7)";
      }
      if (ring2) {
        ring2.style.animationDuration = "5s";
        ring2.style.borderTopColor = "#10B981";
      }
      gem.style.background = "radial-gradient(circle, #34D399 0%, #059669 100%)";
      gem.style.boxShadow = "0 0 14px #34D399, 0 0 24px rgba(5, 150, 105, 0.8)";
      break;
    default:
      if (ring1) {
        ring1.style.animationDuration = "8s";
        ring1.style.borderColor = "rgba(56, 189, 248, 0.5)";
      }
      if (ring2) {
        ring2.style.animationDuration = "5s";
        ring2.style.borderTopColor = "#38BDF8";
      }
      gem.style.background = "radial-gradient(circle, #38BDF8 0%, #0284C7 100%)";
      gem.style.boxShadow = "0 0 10px #38BDF8, 0 0 18px rgba(2, 132, 199, 0.8)";
      break;
  }
}
