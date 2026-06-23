/**
 * constellation.js
 * Animated particle-and-line canvas background for the hero section.
 */
export function initConstellation(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1;
  let points = [];
  let pointer = { x: -9999, y: -9999 };
  let frame = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(28, Math.min(90, Math.floor(W / 18)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.45,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(18,230,111,.55)';
    ctx.strokeStyle = 'rgba(18,230,111,.12)';
    ctx.lineWidth = 0.6;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const o = points[j];
        const dist = Math.hypot(p.x - o.x, p.y - o.y);
        if (dist < 120) {
          ctx.globalAlpha = (1 - dist / 120) * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(o.x, o.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, { passive: true });
  canvas.addEventListener('pointerleave', () => { pointer = { x: -9999, y: -9999 }; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else frame = requestAnimationFrame(draw);
  });

  resize();
  draw();
}
