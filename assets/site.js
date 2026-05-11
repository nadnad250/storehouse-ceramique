const header = document.querySelector("[data-header]");
const parallaxImage = document.querySelector("[data-parallax]");
const progress = document.querySelector("[data-progress]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const pieces = document.querySelectorAll("[data-piece]");
const toast = document.querySelector("[data-toast]");
const toastButton = document.querySelector("[data-toast-button]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateProgress() {
  if (!progress) {
    return;
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
}

function updateParallax() {
  if (!parallaxImage || prefersReducedMotion) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.09, 46);
  parallaxImage.style.transform = `translateY(${offset}px) scale(1.02)`;
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function applyFilter(filter) {
  document.body.classList.add("is-filtering");

  pieces.forEach((piece) => {
    const shouldShow = filter === "all" || piece.dataset.piece === filter;
    piece.classList.toggle("is-hidden", !shouldShow);
  });
}

updateHeader();
updateProgress();
updateParallax();
window.addEventListener("scroll", () => {
  updateHeader();
  updateProgress();
  updateParallax();
}, { passive: true });

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilter(button.dataset.filter);
  });
});

pieces.forEach((piece) => {
  const title = piece.querySelector("h3")?.textContent || "piece";
  piece.querySelector(".piece-photo")?.addEventListener("click", () => {
    showToast(`${title} ajout\u00e9e \u00e0 votre s\u00e9lection.`);
  });
});

toastButton?.addEventListener("click", () => {
  showToast("Pi\u00e8ce favorite ajout\u00e9e. On vous la garde au chaud.");
});
