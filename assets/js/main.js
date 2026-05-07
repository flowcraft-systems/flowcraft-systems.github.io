// FlowCraft Systems — entry module
// Wires up: reduced-motion guard, IntersectionObserver reveals, lazy-loaded canvases.

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Reveal-on-scroll ─────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .loop');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

/* ─── Animate product mock bars when in view ───────────────────────────── */
const animatedBars = document.querySelectorAll('[data-fill]');
if ('IntersectionObserver' in window) {
  const barIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const target = e.target;
          requestAnimationFrame(() => {
            target.style.width = target.dataset.fill + '%';
          });
          barIO.unobserve(target);
        }
      }
    },
    { threshold: 0.5 }
  );
  animatedBars.forEach((b) => barIO.observe(b));
} else {
  animatedBars.forEach((b) => (b.style.width = b.dataset.fill + '%'));
}

/* ─── Nav scroll state ─────────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 12) nav.style.borderBottomColor = 'var(--border-bright)';
    else nav.style.borderBottomColor = 'var(--border)';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── Lazy-load canvas-heavy motion modules ────────────────────────────── */
if (!prefersReducedMotion) {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  idle(() => {
    import('./flow-field.js').then((m) => m.init?.()).catch(() => {});
    import('./constellation.js').then((m) => m.init?.()).catch(() => {});
  });
}
