/**
 * NaviSteel Cinematic Maritime Motion & Physics Engine (SIH26006)
 * "A living ocean intelligence control tower."
 */

/**
 * 1. Living Ocean Harmonic Wave Physics Simulation (HTML5 Canvas)
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
    // Render single static marine gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "rgba(2, 132, 199, 0.08)");
    grad.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Harmonic wave layers
  const waves = [
    { length: 0.005, amplitude: 14, speed: 0.015, color: "rgba(56, 189, 248, 0.07)", yOffset: height * 0.72 },
    { length: 0.008, amplitude: 10, speed: 0.022, color: "rgba(14, 165, 233, 0.09)", yOffset: height * 0.78 },
    { length: 0.012, amplitude: 7,  speed: 0.030, color: "rgba(2, 132, 199, 0.12)", yOffset: height * 0.85 }
  ];

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
    waves[0].yOffset = height * 0.72;
    waves[1].yOffset = height * 0.78;
    waves[2].yOffset = height * 0.85;
  }, { passive: true });

  let animationFrameId = null;

  function render() {
    ctx.clearRect(0, 0, width, height);
    step += 0.02;

    // Smooth mouse interpolation & dampening
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;
    mouse.rippleStrength *= 0.96;

    // Render multi-layer harmonic waves
    waves.forEach((w, layerIdx) => {
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 12) {
        // Base harmonic wave
        let y = Math.sin(x * w.length + step * (layerIdx + 1) * 0.6) * w.amplitude;
        y += Math.cos(x * w.length * 0.5 + step * 0.4) * (w.amplitude * 0.5);

        // Ripple modifier near cursor
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        if (dist < 180) {
          const rippleFactor = (1 - dist / 180) * mouse.rippleStrength * 16;
          y += Math.sin(dist * 0.08 - step * 3) * rippleFactor;
        }

        ctx.lineTo(x, w.yOffset + y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
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
    // Smooth Quintic Ease-Out
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
 * 3. Live Decision Pipeline Progress Tracker
 */
export function updateDecisionPipeline(stepIndex = 1, isApproved = true) {
  const progressBar = document.getElementById("pipelineProgressBar");
  const nodes = document.querySelectorAll(".pipeline-node");
  if (!nodes || nodes.length === 0) return;

  const percentages = [0, 20, 40, 60, 80, 100];
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
    // Trigger reflow
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
 * 6. NAVI AI Orbital Core Processing States
 */
export function updateNaviAiState(state = "idle") {
  const gem = document.querySelector(".orbital-center-gem");
  const ring1 = document.querySelector(".orbital-ring-1");
  const ring2 = document.querySelector(".orbital-ring-2");
  if (!gem) return;

  switch (state) {
    case "evaluating":
      if (ring1) ring1.style.animationDuration = "2.5s";
      if (ring2) ring2.style.animationDuration = "1.5s";
      gem.style.boxShadow = "0 0 16px #38BDF8, 0 0 28px #0284C7";
      break;
    case "rejected":
      if (ring1) ring1.style.borderColor = "rgba(220, 38, 38, 0.6)";
      if (ring2) ring2.style.borderTopColor = "#DC2626";
      gem.style.background = "radial-gradient(circle, #EF4444 0%, #B91C1C 100%)";
      gem.style.boxShadow = "0 0 16px #EF4444, 0 0 28px rgba(185, 28, 28, 0.8)";
      break;
    case "optimized":
    case "ready":
      if (ring1) {
        ring1.style.animationDuration = "8s";
        ring1.style.borderColor = "rgba(16, 185, 129, 0.6)";
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
