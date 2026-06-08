// ─── DARK MODE ───
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// ─── SCROLL PROGRESS ───
(function() {
  const indicator = document.getElementById('scrollIndicator');
  const backTop = document.getElementById('backTop');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    const s = document.documentElement;
    const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    indicator.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('visible', s.scrollTop > 400);
  });
})();

// ─── ACTIVE NAV (multi-page) ───
(function() {
  const page = document.body.getAttribute('data-page');
  const map = {home:'index.html',about:'about.html',experience:'experience.html',education:'education.html',projects:'projects.html',skills:'skills.html',achievements:'achievements.html',contact:'contact.html'};
  const href = map[page];
  if (href) {
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === href) a.classList.add('active');
    });
  }
})();

// ─── SCROLL REVEAL + STAGGER ───
(function() {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('stagger-children')) {
          Array.from(e.target.children).forEach((child, i) => {
            child.style.transitionDelay = (i * 0.1) + 's';
          });
        }
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .stagger-children').forEach(el => revealObs.observe(el));
})();

// ─── SKILL BARS ───
(function() {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-list').forEach(el => barObs.observe(el));
})();

// ─── TYPEWRITER ───
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = ['Data Analyst', 'Data Scientist', 'Statistical Analyst', 'ML Engineer'];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 400); return; }
      setTimeout(type, 40);
    } else {
      el.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) { isDeleting = true; setTimeout(type, 2200); return; }
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 800);
})();

// ─── ANIMATED COUNTERS ───
(function() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const duration = 1500, start = performance.now();
        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));
})();

// ─── 3D TILT EFFECT ───
(function() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const midX = rect.width / 2, midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * 6;
      const rotateX = ((midY - y) / midY) * 6;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ─── RADAR CHART ───
(function() {
  const svg = document.getElementById('radarSvg');
  if (!svg) return;
  const cx = 150, cy = 150, maxR = 110;
  const data = [
    { label: 'Statistics', value: 0.95 }, { label: 'Python', value: 0.88 },
    { label: 'R', value: 0.90 }, { label: 'ML/DL', value: 0.85 },
    { label: 'BI Tools', value: 0.82 }, { label: 'SQL', value: 0.78 },
    { label: 'Clinical', value: 0.83 }
  ];
  const n = data.length, angle = (2 * Math.PI) / n;

  function polarToXY(r, i) {
    const a = angle * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  [0.25, 0.5, 0.75, 1].forEach(frac => {
    const r = maxR * frac, pts = [];
    for (let i = 0; i < n; i++) pts.push(polarToXY(r, i).join(','));
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('class', 'radar-grid-line');
    svg.appendChild(poly);
  });

  for (let i = 0; i < n; i++) {
    const [x, y] = polarToXY(maxR, i);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
    line.setAttribute('class', 'radar-axis');
    svg.appendChild(line);
  }

  const dataPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const centerPts = [], targetPts = [];
  for (let i = 0; i < n; i++) {
    centerPts.push(cx + ',' + cy);
    const [x, y] = polarToXY(maxR * data[i].value, i);
    targetPts.push(x + ',' + y);
  }
  dataPoly.setAttribute('points', centerPts.join(' '));
  dataPoly.setAttribute('class', 'radar-area');
  svg.appendChild(dataPoly);

  const dots = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = polarToXY(maxR * data[i].value, i);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
    dot.setAttribute('r', '4'); dot.setAttribute('class', 'radar-dot');
    svg.appendChild(dot); dots.push(dot);
  }

  for (let i = 0; i < n; i++) {
    const [x, y] = polarToXY(maxR + 22, i);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x); text.setAttribute('y', y);
    text.setAttribute('class', 'radar-label');
    text.textContent = data[i].label;
    svg.appendChild(text);
  }

  const radarObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dataPoly.setAttribute('points', targetPts.join(' '));
        dataPoly.classList.add('visible');
        dots.forEach(d => d.classList.add('visible'));
        radarObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const wrap = document.getElementById('radarWrap');
  if (wrap) radarObs.observe(wrap);
})();

// ─── LIGHTBOX ───
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.getElementById('lightboxImg').src = src;
  lb.style.display = 'flex';
  requestAnimationFrame(() => lb.classList.add('open'));
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  setTimeout(() => { lb.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── HAMBURGER ───
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── FORM SUBMIT ───
function handleFormSubmit(btn) {
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #28ca41, #00b89c)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

// ─── HERO STAGGER (index.html only) ───
(function() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
})();

// ─── DYNAMIC ORBS ───
(function() {
  if (document.querySelector('.bg-orb')) return;
  const orb1 = document.createElement('div');
  orb1.className = 'bg-orb bg-orb-1';
  const orb2 = document.createElement('div');
  orb2.className = 'bg-orb bg-orb-2';
  document.body.prepend(orb1, orb2);
})();

// ─── SPOTLIGHT EFFECT ───
(function() {
  document.querySelectorAll('.glass').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();
