/* ============================================================
   particles.js — canvas star-field / particle system
   Used only on index.html hero section
   ============================================================ */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Respect the reader's motion setting
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');

  // ── Config ──────────────────────────────────────────────────
  const CONFIG = {
    count:         70,      // number of particles
    maxSpeed:      0.25,    // max velocity
    minRadius:     1,       // min particle radius
    maxRadius:     2.5,     // max particle radius
    connectDist:   130,     // max distance to draw connecting lines
    accentColor:   '45, 212, 191',   // --accent RGB
    accentColor2:  '148, 163, 184',  // muted slate
    mouseRadius:   150,     // mouse repulsion radius
    mouseStrength: 0.3,
  };

  // ── State ────────────────────────────────────────────────────
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  // ── Resize ───────────────────────────────────────────────────
  // Canvas fills its parent (the hero), not the whole window
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  // ── Mouse tracking ───────────────────────────────────────────
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ── Particle class ───────────────────────────────────────────
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : -10;
      this.vx = (Math.random() - 0.5) * CONFIG.maxSpeed * 2;
      this.vy = (Math.random() * CONFIG.maxSpeed) + 0.1;
      this.r  = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      // alternate accent colors
      this.color = Math.random() > 0.7
        ? CONFIG.accentColor2
        : CONFIG.accentColor;
      this.alpha = 0.3 + Math.random() * 0.6;
    }

    update() {
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRadius) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          this.vx += (dx / dist) * force * CONFIG.mouseStrength;
          this.vy += (dy / dist) * force * CONFIG.mouseStrength;
        }
      }

      // Dampen velocity
      this.vx *= 0.995;
      this.vy *= 0.995;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap horizontal edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;

      // Reset if off bottom
      if (this.y > canvas.height + 10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
  }

  // ── Draw connections ──────────────────────────────────────────
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const opacity = (1 - dist / CONFIG.connectDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.accentColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // ── Animation loop ────────────────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    for (const p of particles) {
      p.update();
      p.draw();
    }

    animId = requestAnimationFrame(animate);
  }

  // ── Bootstrap ─────────────────────────────────────────────────
  resize();
  init();
  animate();
})();
