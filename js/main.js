// <!-- ============ SCRIPT ============ -->

(function () {
  "use strict";

  /* ---------- Nomor WhatsApp Tujuan (GANTI sesuai nomor Anda) ---------- */
  const WA_NUMBER = "6282364967594";

  /* ---------- Tahun footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Dark / Light Mode ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", function () {
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("velo-theme", isDark ? "dark" : "light");
    } catch (e) {}
  });

  /* ---------- Navbar scroll ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  burgerBtn.addEventListener("click", function () {
    const open = mobileMenu.classList.toggle("open");
    burgerBtn.classList.toggle("active", open);
    burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    burgerBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Active nav link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id,
              );
            });
          }
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- HERO CAROUSEL ---------- */
  (function initHeroCarousel() {
    const carousel = document.getElementById("heroCarousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".hero-slide");
    const dots = carousel.querySelectorAll("[data-carousel-dot]");
    const btnPrev = carousel.querySelector("[data-carousel-prev]");
    const btnNext = carousel.querySelector("[data-carousel-next]");
    const total = slides.length;
    let index = 0;
    let timer = null;
    const AUTOPLAY_MS = 4500;

    function render() {
      slides.forEach(function (s, i) {
        s.classList.toggle("active", i === index);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }
    function next() {
      index = (index + 1) % total;
      render();
    }
    function prev() {
      index = (index - 1 + total) % total;
      render();
    }
    function goTo(i) {
      index = i;
      render();
    }
    function play() {
      stop();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (btnNext)
      btnNext.addEventListener("click", function () {
        next();
        play();
      });
    if (btnPrev)
      btnPrev.addEventListener("click", function () {
        prev();
        play();
      });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        play();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", play);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else play();
    });

    let touchStartX = 0,
      touchEndX = 0;
    carousel.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stop();
      },
      { passive: true },
    );
    carousel.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          diff < 0 ? next() : prev();
        }
        play();
      },
      { passive: true },
    );

    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        next();
        play();
      }
      if (e.key === "ArrowLeft") {
        prev();
        play();
      }
    });

    render();
    play();
  })();

  /* ---------- Tombol "Pilih Paket Ini" ---------- */
  const paketSelect = document.getElementById("paket");
  document.querySelectorAll(".pilih-paket").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const value = btn.getAttribute("data-paket");
      let matched = false;
      Array.from(paketSelect.options).forEach(function (opt) {
        if (opt.textContent.trim() === value) {
          paketSelect.value = opt.value;
          matched = true;
        }
      });
      if (!matched) {
        Array.from(paketSelect.options).forEach(function (opt) {
          if (
            !matched &&
            value &&
            opt.textContent.indexOf(value.split("(")[0].trim()) !== -1
          ) {
            paketSelect.value = opt.value;
            matched = true;
          }
        });
      }
    });
  });

  /* ---------- Form → WhatsApp ---------- */
  const form = document.getElementById("waForm");
  const formError = document.getElementById("formError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const bisnis = document.getElementById("bisnis").value.trim();
    const paket = document.getElementById("paket").value;
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !whatsapp || !paket || !pesan) {
      formError.textContent =
        "Mohon lengkapi kolom bertanda * sebelum mengirim.";
      formError.classList.remove("hidden");
      return;
    }
    formError.classList.add("hidden");

    const lines = [
      "*PENGAJUAN PROYEK BARU — VELO*",
      "",
      "*Nama* : " + nama,
      "*WhatsApp* : " + whatsapp,
      "*Bisnis/Brand* : " + (bisnis || "-"),
      "*Paket* : " + paket,
      "",
      "*Brief/Kebutuhan* :",
      pesan,
      "",
      "Mohon informasi selanjutnya. Terima kasih.",
    ];

    const text = encodeURIComponent(lines.join("\n"));
    const url = "https://wa.me/" + WA_NUMBER + "?text=" + text;

    window.open(url, "_blank");
  });

  /* ---------- Scroll Progress ---------- */
  const progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById("backToTop");
  function toggleBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 600);
  }
  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Exit Intent Modal ---------- */
  (function initExitIntent() {
    const modal = document.getElementById("exitModal");
    const closeBtn = document.getElementById("exitClose");
    const primary = document.getElementById("exitCtaPrimary");
    const KEY = "velo-exit-shown";

    // Hanya tampil sekali per sesi
    let shown = false;
    try {
      shown = sessionStorage.getItem(KEY) === "1";
    } catch (e) {}

    function openModal() {
      if (shown) return;
      shown = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch (e) {}
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    // Desktop: mouse keluar dari window bagian atas
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY < 10) {
        openModal();
      }
    });

    // Fallback: setelah 45 detik di halaman (mobile)
    setTimeout(function () {
      if (window.innerWidth < 1024) openModal();
    }, 45000);

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
    if (primary) primary.addEventListener("click", closeModal);
  })();
})();
