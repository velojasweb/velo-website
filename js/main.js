const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
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

// ===== FILTER PORTFOLIO =====
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".mock");

// ===== TOGGLE "LIHAT LEBIH BANYAK / SEDIKIT" =====
const toggleBtn = document.getElementById("toggleMoreBtn");
let showAll = false; // state: apakah sedang menampilkan semua item
const INITIAL_VISIBLE = 3; // jumlah item yang ditampilkan awal

function updateToggleButton() {
  // Ambil semua item yang TIDAK sedang disembunyikan oleh filter (yaitu yang tidak punya class 'hide')
  const visibleItems = Array.from(
    document.querySelectorAll(".mock:not(.hide)"),
  );
  const totalVisible = visibleItems.length;

  // Tampilkan tombol hanya jika total item yang tampil > INITIAL_VISIBLE
  if (totalVisible > INITIAL_VISIBLE) {
    toggleBtn.classList.remove("hidden");
  } else {
    toggleBtn.classList.add("hidden");
    // Jika total <= batas, pastikan semua item yang tampil terlihat (tidak ada yang disembunyikan oleh toggle)
    // dan reset state showAll
    showAll = false;
    // Hapus class 'extra' dari semua item
    visibleItems.forEach((item) => item.classList.remove("extra"));
    return;
  }

  // Atur teks tombol berdasarkan state
  toggleBtn.textContent = showAll
    ? "Lihat lebih sedikit"
    : "Lihat lebih banyak";
}

// Fungsi untuk toggle tampilan
function toggleMore() {
  const visibleItems = Array.from(
    document.querySelectorAll(".mock:not(.hide)"),
  );
  const totalVisible = visibleItems.length;

  if (totalVisible <= INITIAL_VISIBLE) {
    // Tidak perlu toggle, tapi amankan
    return;
  }

  if (!showAll) {
    // Tampilkan semua: hapus class 'extra' dari semua (karena 'extra' kita pakai untuk menyembunyikan)
    // Kita akan gunakan class 'extra' untuk item yang melebihi batas awal.
    // Saat "lihat lebih banyak", kita hapus class 'extra' dari semua item yang tampil.
    visibleItems.forEach((item) => item.classList.remove("extra"));
    showAll = true;
  } else {
    // Sembunyikan lagi: tambahkan class 'extra' pada item yang melebihi batas awal
    visibleItems.forEach((item, index) => {
      if (index >= INITIAL_VISIBLE) {
        item.classList.add("extra");
      }
    });
    showAll = false;
  }
  updateToggleButton();
}

// Refactor: kita ubah kode filter yang sudah ada menjadi fungsi applyFilter
function applyFilter(filterValue) {
  const items = document.querySelectorAll(".mock");
  items.forEach((item) => {
    if (filterValue === "all" || item.dataset.category === filterValue) {
      item.classList.remove("hide");
    } else {
      item.classList.add("hide");
      // Juga hapus class 'extra' jika item disembunyikan filter
      item.classList.remove("extra");
    }
  });
  // Setelah filter, reset state showAll dan update tombol
  showAll = false;
  // Terapkan batas awal: item index >= INITIAL_VISIBLE diberi class 'extra'
  const visibleItems = Array.from(
    document.querySelectorAll(".mock:not(.hide)"),
  );
  visibleItems.forEach((item, index) => {
    if (index >= INITIAL_VISIBLE) {
      item.classList.add("extra");
    } else {
      item.classList.remove("extra");
    }
  });
  updateToggleButton();
}

// Event listener filter menggunakan applyFilter
filterButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    const filterValue = this.dataset.filter;
    applyFilter(filterValue);
  });
});

// Event listener tombol toggle
toggleBtn.addEventListener("click", toggleMore);

// Jalankan pertama kali saat halaman dimuat untuk mengatur state awal
document.addEventListener("DOMContentLoaded", function () {
  // Aktifkan filter "Semua" secara default
  const defaultFilter = document.querySelector(".filter-btn.active");
  if (defaultFilter) {
    applyFilter(defaultFilter.dataset.filter);
  } else {
    applyFilter("all");
  }
});
