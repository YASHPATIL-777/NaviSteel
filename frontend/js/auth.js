// NaviSteel Prototype Authentication Controller (Frontend Prototype Access Gateway)

export function initAuth(onAuthSuccess) {
  const loginScreen = document.getElementById("loginScreen");
  const appLayout = document.getElementById("appLayout");
  const authOverlay = document.getElementById("authTransitionOverlay");
  const signInBtn = document.getElementById("signInBtn");
  const enterDemoBtn = document.getElementById("enterDemoBtn");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const authUserName = document.getElementById("authUserName");
  const authStatusText = document.getElementById("authStatusText");
  const topUserName = document.getElementById("topUserName");
  const topUserRole = document.getElementById("topUserRole");
  const topUserAvatar = document.getElementById("topUserAvatar");
  const dropdownRoleLabel = document.getElementById("dropdownRoleLabel");
  const userProfileWrapper = document.getElementById("userProfileWrapper");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const rolePills = document.querySelectorAll(".role-pill-btn");

  let currentRole = "SAIL Charterer";
  let currentUserName = "Yash Patil";

  // Role Selection
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
    sessionStorage.setItem("navisteel_role", currentRole);
    sessionStorage.setItem("navisteel_name", currentUserName);

    // Update Topbar Profile
    if (topUserName) topUserName.innerText = currentUserName.split(" ")[0] + " " + currentUserName.split(" ")[1];
    if (topUserRole) topUserRole.innerText = `● ${currentRole.toUpperCase()}`;
    if (topUserAvatar) {
      const initials = currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("");
      topUserAvatar.innerText = initials;
    }
    if (dropdownRoleLabel) dropdownRoleLabel.innerText = currentRole;

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

  // Logout / Sign Out
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionStorage.removeItem("navisteel_auth");
      sessionStorage.removeItem("navisteel_role");
      sessionStorage.removeItem("navisteel_name");

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
    const savedRole = sessionStorage.getItem("navisteel_role") || "SAIL Charterer";
    const savedName = sessionStorage.getItem("navisteel_name") || "Yash Patil";
    currentRole = savedRole;
    currentUserName = savedName;

    if (topUserName) topUserName.innerText = currentUserName.split(" ")[0] + " " + currentUserName.split(" ")[1];
    if (topUserRole) topUserRole.innerText = `● ${currentRole.toUpperCase()}`;
    if (topUserAvatar) {
      const initials = currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("");
      topUserAvatar.innerText = initials;
    }
    if (dropdownRoleLabel) dropdownRoleLabel.innerText = currentRole;

    if (loginScreen) loginScreen.style.display = "none";
    if (appLayout) appLayout.style.display = "flex";
    if (onAuthSuccess) onAuthSuccess();
  } else {
    if (loginScreen) loginScreen.style.display = "flex";
    if (appLayout) appLayout.style.display = "none";
  }
}
