// ===== NAV TOGGLE (Mobile Menu) =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

// ===== FILTER PORTFOLIO =====
document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector(".portfolio-grid");
  var tabs = document.querySelector(".filter-tabs");
  if (!grid || !tabs) return;

  var pagination = document.getElementById("pagination");
  var emptyState = document.getElementById("emptyState");
  var countEl = document.getElementById("portfolioCount");
  var PER_PAGE = pagination ? 6 : 999;
  var activeFilter = "all";
  var activePage = 1;

  function allCards() {
    return Array.prototype.slice.call(grid.querySelectorAll(".mock"));
  }

  function render() {
    var all = allCards();
    var list =
      activeFilter === "all"
        ? all
        : all.filter(function (c) {
            return c.getAttribute("data-category") === activeFilter;
          });

    var totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (activePage > totalPages) activePage = totalPages;

    var start = (activePage - 1) * PER_PAGE;
    var visible = list.slice(start, start + PER_PAGE);

    all.forEach(function (c) {
      c.style.display = "none";
    });
    visible.forEach(function (c) {
      c.style.display = "";
    });

    if (countEl) {
      var label = "Menampilkan " + list.length + " project";
      if (activeFilter !== "all") label += " · kategori: " + activeFilter;
      countEl.textContent = label;
    }
    if (emptyState)
      emptyState.style.display = list.length === 0 ? "block" : "none";

    if (!pagination) return;
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    function goTo(p) {
      activePage = p;
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    var prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "←";
    prev.disabled = activePage === 1;
    prev.addEventListener("click", function () {
      goTo(activePage - 1);
    });
    pagination.appendChild(prev);

    for (var i = 1; i <= totalPages; i++) {
      (function (n) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = n;
        if (n === activePage) btn.classList.add("active");
        btn.addEventListener("click", function () {
          goTo(n);
        });
        pagination.appendChild(btn);
      })(i);
    }

    var next = document.createElement("button");
    next.type = "button";
    next.textContent = "→";
    next.disabled = activePage === totalPages;
    next.addEventListener("click", function () {
      goTo(activePage + 1);
    });
    pagination.appendChild(next);
  }

  tabs.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-btn");
    if (!btn) return;
    tabs.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active", "is-active");
    });
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter") || "all";
    activePage = 1;
    render();
  });

  render();
});
