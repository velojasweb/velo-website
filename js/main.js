// ============================================
// VELO — MAIN SCRIPT
// ============================================

// ===== THEME TOGGLE =====
(function () {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", function () {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("velo-theme", next);
  });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", function (e) {
    if (!localStorage.getItem("velo-theme")) {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light",
      );
    }
  });
})();

// ===== NAVBAR TOGGLE =====
(function () {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
    });
  });
})();

// ===== NAVBAR SCROLL =====
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 20) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== SCROLL REVEAL =====
(function () {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
})();

// ===== COUNTER ANIMATION =====
(function () {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();

// ===== SMOOTH SCROLL WITH OFFSET =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

// ===== MARQUEE PAUSE ON HOVER =====
(function () {
  const marquee = document.querySelector(".marquee-track");
  if (!marquee) return;
  marquee.addEventListener("mouseenter", function () {
    marquee.style.animationPlayState = "paused";
  });
  marquee.addEventListener("mouseleave", function () {
    marquee.style.animationPlayState = "running";
  });
})();

// ===== ACTIVE NAV LINK (auto highlight current page) =====
(function () {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;
    // Cocokkan path
    if (
      (href === "/" && path === "/") ||
      (href !== "/" && href !== "#" && path.startsWith(href))
    ) {
      link.classList.add("current");
    }
  });
})();
