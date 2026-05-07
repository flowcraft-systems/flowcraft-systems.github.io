// Hero flow-field — Perlin-style noise field driving violet/cyan particles.
// Pauses when off-screen or tab is hidden.

export function init() {
  const canvas = document.getElementById('flow-field-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  let particles = [];
  let raf = 0;
  let running = true;

  /* tiny value-noise (good enough for a flow field) */
  const PERM_SIZE = 256;
  const perm = new Uint8Array(PERM_SIZE * 2);
  const seeded = new Uint8Array(PERM_SIZE);
  for (let i = 0; i < PERM_SIZE; i++) seeded[i] = i;
  for (let i = PERM_SIZE - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
  }
  for (let i = 0; i < PERM_SIZE * 2; i++) perm[i] = seeded[i & (PERM_SIZE - 1)];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y) => {
    const u = (h & 1) ? x : -x;
    const v = (h & 2) ? y : -y;
    return u + v;
  };
  function noise2(x, y) {
    const X = Math.floor(x) & (PERM_SIZE - 1);
    const Y = Math.floor(y) & (PERM_SIZE - 1);
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const A = perm[X] + Y, B = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[A],     x,     y), grad(perm[B],     x - 1, y),     u),
      lerp(grad(perm[A + 1], x,     y - 1), grad(perm[B + 1], x - 1, y - 1), u),
      v
    );
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const target = Math.min(620, Math.floor((w * h) / 2400));
    particles = new Array(target).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      px: 0, py: 0,
      life: Math.random() * 240,
      max: 200 + Math.random() * 280,
      hue: Math.random() < 0.7 ? 0 : 1, // 0=violet, 1=cyan
    }));
  }

  let t = 0;
  function frame() {
    if (!running) return;
    t += 0.0008;

    // Trail fade
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(6, 6, 13, 0.08)';
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';

    for (const p of particles) {
      const n = noise2(p.x * 0.0024, p.y * 0.0024 + t * 30);
      const angle = n * Math.PI * 2.3;
      p.px = p.x; p.py = p.y;
      p.x += Math.cos(angle) * 0.9;
      p.y += Math.sin(angle) * 0.9;
      p.life++;

      if (
        p.life > p.max || p.x < -10 || p.x > w + 10 ||
        p.y < -10 || p.y > h + 10
      ) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.px = p.x; p.py = p.y;
        p.life = 0;
      }

      const alpha = 0.18 * (1 - p.life / p.max);
      ctx.strokeStyle = p.hue === 0
        ? `rgba(139, 92, 246, ${alpha})`
        : `rgba(34, 211, 238, ${alpha})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop()  { running = false; cancelAnimationFrame(raf); }

  resize();
  raf = requestAnimationFrame(frame);

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(resize, 150);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) start(); else stop();
      }
    });
    io.observe(canvas);
  }
}
