// <!-- ============ SCRIPT ============ -->
(function () {
  "use strict";

  /* ---------- Nomor WhatsApp Tujuan (GANTI sesuai nomor Anda) ---------- */
  const WA_NUMBER = "6282364967594";

  /* ---------- Konfigurasi Pagination ---------- */
  const PER_PAGE = 6; // jumlah template per halaman

  /* ---------- Tahun footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Dark / Light Mode ---------- */
  const root = document.documentElement;
  document.getElementById("themeToggle").addEventListener("click", function () {
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("velo-theme", isDark ? "dark" : "light");
    } catch (e) {}
  });

  /* ---------- Navbar scroll ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () =>
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  burgerBtn.addEventListener("click", function () {
    const open = mobileMenu.classList.toggle("open");
    burgerBtn.classList.toggle("active", open);
    burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      burgerBtn.classList.remove("active");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      mobileMenu.classList.remove("open");
      burgerBtn.classList.remove("active");
      burgerBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  const toggleBtt = () =>
    backToTop.classList.toggle("show", window.scrollY > 600);
  toggleBtt();
  window.addEventListener("scroll", toggleBtt, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================================================
     FILTER KATEGORI + PAGINATION
     ============================================================ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const allCards = Array.from(document.querySelectorAll(".tpl-card"));
  const resultCountEl = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  const pageInfo = document.getElementById("pageInfo");
  const paginationNav = document.getElementById("paginationNav");
  const paginationWrap = document.getElementById("paginationWrap");
  const gridAnchor = document.getElementById("gridAnchor");

  let currentFilter = "all";
  let currentPage = 1;
  let filteredCards = [];

  // Hitung jumlah per kategori
  const counts = {
    all: allCards.length,
    landing: 0,
    company: 0,
    katalog: 0,
  };
  allCards.forEach(function (c) {
    const cat = c.getAttribute("data-category");
    if (counts[cat] !== undefined) counts[cat]++;
  });
  document.querySelectorAll("[data-count]").forEach(function (el) {
    const k = el.getAttribute("data-count");
    el.textContent = "(" + (counts[k] || 0) + ")";
  });

  /* -- Bangun daftar kartu sesuai filter aktif -- */
  function buildFilteredList() {
    filteredCards = allCards.filter(function (c) {
      return (
        currentFilter === "all" ||
        c.getAttribute("data-category") === currentFilter
      );
    });
  }

  /* -- Render halaman saat ini -- */
  function renderPage(scrollToGrid) {
    const total = filteredCards.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

    // Safety: jika currentPage melebihi total halaman
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * PER_PAGE;
    const end = Math.min(start + PER_PAGE, total);

    // Sembunyikan semua dulu
    allCards.forEach(function (c) {
      c.style.display = "none";
    });

    // Tampilkan hanya kartu pada rentang halaman ini
    for (let i = start; i < end; i++) {
      filteredCards[i].style.display = "";
    }

    // Update counter & info
    resultCountEl.textContent = total;
    if (total === 0) {
      pageInfo.textContent = "Tidak ada template untuk kategori ini.";
    } else {
      pageInfo.textContent =
        "Menampilkan " +
        (start + 1) +
        "–" +
        end +
        " dari " +
        total +
        " template";
    }

    // Empty state
    emptyState.classList.toggle("hidden", total > 0);

    // Sembunyikan pagination jika hanya 1 halaman atau kosong
    paginationWrap.classList.toggle("hidden", totalPages <= 1);

    // Render tombol pagination
    renderPaginationButtons(totalPages);

    // Scroll ke area grid (jika bukan initial load)
    if (scrollToGrid) {
      const offset =
        gridAnchor.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }

  /* -- Buat tombol Prev, angka, Next -- */
  function renderPaginationButtons(totalPages) {
    paginationNav.innerHTML = "";

    const mkBtn = (html, opts) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "page-btn border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-200";
      btn.innerHTML = html;
      if (opts && opts.disabled) btn.disabled = true;
      if (opts && opts.active) btn.classList.add("active");
      if (opts && opts.label) btn.setAttribute("aria-label", opts.label);
      if (opts && opts.page) btn.setAttribute("data-page", opts.page);
      if (opts && opts.ariaCurrent) btn.setAttribute("aria-current", "page");
      return btn;
    };

    // Prev
    const prevBtn = mkBtn(
      '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg><span class="ml-1">Sebelumnya</span>',
      { disabled: currentPage === 1, label: "Halaman sebelumnya" },
    );
    prevBtn.classList.add("page-btn-arrow");
    prevBtn.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderPage(true);
      }
    });
    paginationNav.appendChild(prevBtn);

    // Nomor halaman (dengan ellipsis jika banyak)
    const pages = getPageNumbers(currentPage, totalPages);
    pages.forEach(function (p) {
      if (p === "...") {
        const dots = document.createElement("span");
        dots.className = "px-2 text-ink-400 dark:text-ink-500 select-none";
        dots.textContent = "…";
        paginationNav.appendChild(dots);
      } else {
        const isActive = p === currentPage;
        const btn = mkBtn(String(p), {
          active: isActive,
          page: p,
          ariaCurrent: isActive ? "page" : null,
          label: "Ke halaman " + p,
        });
        btn.addEventListener("click", function () {
          if (p !== currentPage) {
            currentPage = p;
            renderPage(true);
          }
        });
        paginationNav.appendChild(btn);
      }
    });

    // Next
    const nextBtn = mkBtn(
      '<span class="mr-1">Berikutnya</span><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
      {
        disabled: currentPage === totalPages,
        label: "Halaman berikutnya",
      },
    );
    nextBtn.classList.add("page-btn-arrow");
    nextBtn.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(true);
      }
    });
    paginationNav.appendChild(nextBtn);
  }

  /* -- Hitung nomor halaman yang ditampilkan (dengan "..." jika banyak) -- */
  function getPageNumbers(current, total) {
    const delta = 1; // tampil 1 nomor di kiri & kanan current
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach(function (i) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }

  /* -- Ganti filter -- */
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      currentPage = 1;
      buildFilteredList();
      renderPage(false);
    });
  });

  /* -- Init -- */
  buildFilteredList();
  renderPage(false);

  /* ============================================================
     PREVIEW MODAL
     ============================================================ */
  const modal = document.getElementById("previewModal");
  const modalImage = document.getElementById("previewImage");
  const modalName = document.getElementById("previewName");
  const modalTag = document.getElementById("previewTag");
  const modalDesc = document.getElementById("previewDesc");
  const modalPrice = document.getElementById("previewPrice");
  const modalWa = document.getElementById("previewWa");
  const modalDemo = document.getElementById("previewDemo");
  const closeBtn = document.getElementById("previewClose");
  const closeBtn2 = document.getElementById("previewSecondaryClose");

  function openPreview(card) {
    const name = card.getAttribute("data-name");
    const tag = card.getAttribute("data-tag");
    const price = card.getAttribute("data-price");
    const image = card.getAttribute("data-image");
    const desc = card.getAttribute("data-desc");
    const demo = card.getAttribute("data-demo");

    modalImage.src = image;
    modalImage.alt = "Preview template " + name;
    modalName.textContent = name;
    modalTag.textContent = tag;
    modalDesc.textContent = desc;
    modalPrice.textContent = price;

    if (demo && demo !== "#") {
      modalDemo.href = demo;
      modalDemo.style.display = "";
    } else {
      modalDemo.style.display = "none";
    }

    const waText =
      "Halo VELO, saya tertarik dengan template " +
      name +
      " (" +
      tag +
      ") — " +
      price +
      ". Mohon informasi lebih lanjut.";
    modalWa.href =
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(waText);

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  allCards.forEach(function (card) {
    card.querySelectorAll(".tpl-open").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openPreview(card);
      });
    });
  });

  closeBtn.addEventListener("click", closePreview);
  closeBtn2.addEventListener("click", closePreview);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closePreview();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closePreview();
  });

  /* ---------- Tombol "Pilih" → WA ---------- */
  document.querySelectorAll(".pilih-tpl").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const label = btn.getAttribute("data-wa");
      const text =
        "Halo VELO, saya ingin memilih template: " +
        label +
        ". Mohon informasi selanjutnya.";
      window.open(
        "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text),
        "_blank",
      );
    });
  });
})();
