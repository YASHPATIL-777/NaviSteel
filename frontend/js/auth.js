// NaviSteel Prototype Authentication & Role-Based Lens Controller
import { ROLE_CONFIG, getSidebarIconSvg } from './roleConfig.js';

export function getRoleKeyFromName(nameOrKey) {
  if (!nameOrKey) return "charterer";
  const str = nameOrKey.toLowerCase();
  if (str.includes("ministry")) return "ministry";
  if (str.includes("procurement")) return "procurement";
  if (str.includes("port")) return "portAuthority";
  return "charterer";
}

export function applyRoleLens(roleKeyOrName, onRoleChanged) {
  const roleKey = getRoleKeyFromName(roleKeyOrName);
  const cfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.charterer;
  
  sessionStorage.setItem("navisteel_active_lens", roleKey);
  sessionStorage.setItem("navisteel_role", cfg.name);
  sessionStorage.setItem("navisteel_name", cfg.defaultUser);

  // Update Topbar Profile
  const topUserName = document.getElementById("topUserName");
  const topUserRole = document.getElementById("topUserRole");
  const topUserAvatar = document.getElementById("topUserAvatar");
  const dropdownUserName = document.getElementById("dropdownUserName");
  const dropdownRoleLabel = document.getElementById("dropdownRoleLabel");
  const dropdownClearance = document.getElementById("dropdownClearance");

  if (topUserName) topUserName.innerText = cfg.defaultUser;
  if (topUserRole) topUserRole.innerText = `● ${cfg.roleCode}`;
  if (topUserAvatar) {
    const initials = cfg.defaultUser.split(" ").map(n => n[0]).slice(0, 2).join("");
    topUserAvatar.innerText = initials;
  }
  if (dropdownUserName) dropdownUserName.innerText = cfg.defaultUser;
  if (dropdownRoleLabel) dropdownRoleLabel.innerText = cfg.name;
  if (dropdownClearance) dropdownClearance.innerText = cfg.clearance;

  // Update Role Switcher Buttons in Dropdown
  document.querySelectorAll(".role-lens-btn").forEach(btn => {
    const bRoleId = btn.getAttribute("data-role-id");
    const checkSpan = btn.querySelector(".lens-check");
    if (bRoleId === roleKey) {
      btn.classList.add("active");
      if (checkSpan) checkSpan.style.display = "inline";
    } else {
      btn.classList.remove("active");
      if (checkSpan) checkSpan.style.display = "none";
    }
  });

  // Update Hero Section
  const heroPillBadgeText = document.getElementById("heroPillBadgeText");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroPrimaryCta = document.getElementById("heroPrimaryCta");
  const heroSecondaryCta = document.getElementById("heroSecondaryCta");

  if (heroPillBadgeText) heroPillBadgeText.innerText = cfg.badgeText;
  if (heroTitle) heroTitle.innerHTML = cfg.heroTitle;
  if (heroSubtitle) heroSubtitle.innerText = cfg.heroSubtitle;
  if (heroPrimaryCta) {
    heroPrimaryCta.innerText = cfg.primaryCtaText;
    heroPrimaryCta.setAttribute("href", cfg.primaryCtaHref);
  }
  if (heroSecondaryCta) {
    heroSecondaryCta.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> ${cfg.secondaryCtaText}`;
  }

  // Update Sidebar Navigation Links
  const sidebarNavLinks = document.getElementById("sidebarNavLinks");
  if (sidebarNavLinks && cfg.sidebarNav) {
    sidebarNavLinks.innerHTML = cfg.sidebarNav.map((item, idx) => `
      <a href="#${item.id}" class="sidebar-link ${idx === 0 ? 'active' : ''}">
        ${getSidebarIconSvg(item.icon)}
        ${item.label}
      </a>
    `).join("");
  }

  if (onRoleChanged) {
    onRoleChanged(roleKey);
  }
}

export function initAuth(onAuthSuccess, onRoleChanged) {
  const loginScreen = document.getElementById("loginScreen");
  const appLayout = document.getElementById("appLayout");
  const authOverlay = document.getElementById("authTransitionOverlay");
  const signInBtn = document.getElementById("signInBtn");
  const enterDemoBtn = document.getElementById("enterDemoBtn");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const authUserName = document.getElementById("authUserName");
  const authStatusText = document.getElementById("authStatusText");
  const userProfileWrapper = document.getElementById("userProfileWrapper");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const rolePills = document.querySelectorAll(".role-pill-btn");
  const roleLensBtns = document.querySelectorAll(".role-lens-btn");

  let currentRole = "SAIL Charterer";
  let currentUserName = "Yash Patil";

  // Role Selection on Login Screen
  rolePills.forEach(pill => {
    pill.addEventListener("click", () => {
      rolePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentRole = pill.getAttribute("data-role");
      loginEmail.value = pill.getAttribute("data-email");

      if (currentRole === "Ministry Official") {
        currentUserName = "Dr. Rajesh Kumar (Joint Secy)";
      } else if (currentRole === "SAIL Charterer") {
        currentUserName = "Yash Patil (Chief Charterer)";
      } else if (currentRole === "Procurement Manager") {
        currentUserName = "A. K. Sharma (Head Logistics)";
      } else if (currentRole === "Port Authority") {
        currentUserName = "Capt. V. Mukherjee (Harbour Master)";
      }

      if (authUserName) {
        authUserName.innerText = currentUserName;
      }
    });
  });

  // Enter Control Tower Procedure
  function grantAccess(isDemoDirect = false) {
    sessionStorage.setItem("navisteel_auth", "true");
    const roleKey = getRoleKeyFromName(currentRole);
    applyRoleLens(roleKey, onRoleChanged);

    if (isDemoDirect) {
      if (loginScreen) loginScreen.style.display = "none";
      if (appLayout) appLayout.style.display = "flex";
      if (onAuthSuccess) onAuthSuccess();
      return;
    }

    // Animated Transition Sequence (1.8s)
    if (authOverlay) authOverlay.style.display = "flex";

    const chk1 = document.getElementById("chk1");
    const chk2 = document.getElementById("chk2");
    const chk3 = document.getElementById("chk3");
    const chk4 = document.getElementById("chk4");

    setTimeout(() => {
      if (chk1) {
        chk1.classList.add("active");
        chk1.querySelector(".chk-icon").innerText = "✓";
      }
    }, 350);

    setTimeout(() => {
      if (chk2) {
        chk2.classList.add("active");
        chk2.querySelector(".chk-icon").innerText = "✓";
      }
    }, 750);

    setTimeout(() => {
      if (chk3) {
        chk3.classList.add("active");
        chk3.querySelector(".chk-icon").innerText = "✓";
      }
    }, 1150);

    setTimeout(() => {
      if (chk4) {
        chk4.classList.add("active");
        chk4.querySelector(".chk-icon").innerText = "✓";
      }
      if (authStatusText) {
        authStatusText.innerText = "ENTERING CONTROL TOWER →";
        authStatusText.style.color = "#34D399";
      }
    }, 1550);

    setTimeout(() => {
      if (authOverlay) authOverlay.style.display = "none";
      if (loginScreen) loginScreen.style.display = "none";
      if (appLayout) {
        appLayout.style.display = "flex";
        appLayout.style.animation = "fadeIn 0.4s ease-out";
      }
      if (onAuthSuccess) onAuthSuccess();
    }, 1900);
  }

  // Submit / Sign In
  if (signInBtn) {
    signInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      grantAccess(false);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      grantAccess(false);
    });
  }

  // Demo Environment Direct Entry
  if (enterDemoBtn) {
    enterDemoBtn.addEventListener("click", () => {
      grantAccess(true);
    });
  }

  // Profile Dropdown Toggle
  if (userProfileWrapper && userDropdown) {
    userProfileWrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      const isShown = userDropdown.style.display === "flex";
      userDropdown.style.display = isShown ? "none" : "flex";
    });

    document.addEventListener("click", () => {
      userDropdown.style.display = "none";
    });
  }

  // Role Lens Switcher in Profile Dropdown
  roleLensBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const roleId = btn.getAttribute("data-role-id");
      applyRoleLens(roleId, onRoleChanged);
      if (userDropdown) userDropdown.style.display = "none";
    });
  });

  // Logout / Sign Out
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionStorage.removeItem("navisteel_auth");
      sessionStorage.removeItem("navisteel_role");
      sessionStorage.removeItem("navisteel_name");
      sessionStorage.removeItem("navisteel_active_lens");

      if (userDropdown) userDropdown.style.display = "none";
      if (appLayout) appLayout.style.display = "none";
      if (loginScreen) {
        loginScreen.style.display = "flex";
        loginScreen.style.animation = "fadeIn 0.3s ease-out";
      }
    });
  }

  // Check Existing Session
  const isAuth = sessionStorage.getItem("navisteel_auth") === "true";
  if (isAuth) {
    const savedLens = sessionStorage.getItem("navisteel_active_lens") || "charterer";
    applyRoleLens(savedLens, onRoleChanged);

    if (loginScreen) loginScreen.style.display = "none";
    if (appLayout) appLayout.style.display = "flex";
    if (onAuthSuccess) onAuthSuccess();
  } else {
    if (loginScreen) loginScreen.style.display = "flex";
    if (appLayout) appLayout.style.display = "none";
  }
}

