(function() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 90;
  const MAX_DIST = 160;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.r = Math.random() * 2 + 1;
      this.baseOpacity = Math.random() * 0.5 + 0.3;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x -= dx * force * 0.04;
        this.y -= dy * force * 0.04;
      }
      this.pulse += 0.04;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const dotRGB = dark ? '0, 212, 245' : '0, 194, 224';
    const linkRGB = dark ? '91, 156, 246' : '0, 150, 200';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      
      const pulseOpacity = p.baseOpacity + Math.sin(p.pulse) * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotRGB}, ${pulseOpacity})`;
      ctx.fill();
      
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotRGB}, 0.2)`;
        ctx.fill();
      }

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx2 = p.x - p2.x, dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < MAX_DIST) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          const lineOpacity = 0.15 * (1 - dist2 / MAX_DIST);
          ctx.strokeStyle = `rgba(${linkRGB}, ${lineOpacity})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
