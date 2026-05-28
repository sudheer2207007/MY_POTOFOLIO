/* =========================================
   SUDHEER PORTFOLIO 2026 — script.js
   ========================================= */

// ==========================================
// LOADER
// ==========================================
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
let progress = 0;

const loaderInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
      initAnimations();
    }, 400);
  }
  loaderFill.style.width = progress + '%';
}, 120);

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .proj-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ==========================================
// NAVBAR SCROLL
// ==========================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ==========================================
// BURGER MENU
// ==========================================
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ==========================================
// THEME TOGGLE
// ==========================================
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
let isLight = false;

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  isLight = true;
  themeIcon.className = 'fas fa-sun';
}

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
});

// ==========================================
// TYPED ROLE
// ==========================================
const roles = [
  'Data Scientist',
  'ML Engineer',
  'Power BI Developer',
  'Data Analyst',
  'Azure Data Engineer'
];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedRole');

function typeRole() {
  const current = roles[roleIdx];
  if (isDeleting) {
    charIdx--;
  } else {
    charIdx++;
  }
  typedEl.textContent = current.slice(0, charIdx);

  let delay = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 300;
  }
  setTimeout(typeRole, delay);
}
setTimeout(typeRole, 1800);

// ==========================================
// PARTICLE CANVAS
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 255, 164, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124, 255, 164, ${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// REVEAL ON SCROLL
// ==========================================
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ==========================================
// SKILL BARS
// ==========================================
const skillBars = document.querySelectorAll('.sb-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pct = entry.target.dataset.pct;
      setTimeout(() => {
        entry.target.style.width = pct + '%';
        entry.target.classList.add('animated');
      }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current) + '+';
  }, 40);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ==========================================
// PROJECT FILTER
// ==========================================
const filterPills = document.querySelectorAll('.filter-pill');
const projCards = document.querySelectorAll('.proj-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;

    projCards.forEach(card => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      if (show) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.style.display = 'none', 350);
      }
    });
  });
});

// ==========================================
// LIGHTBOX
// ==========================================
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ==========================================
// RADAR CHART
// ==========================================
function initRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Python', 'Power BI', 'SQL', 'Machine Learning', 'Azure', 'Excel', 'Statistics'],
      datasets: [{
        label: 'Proficiency',
        data: [90, 88, 85, 82, 78, 88, 80],
        backgroundColor: 'rgba(124, 255, 164, 0.1)',
        borderColor: 'rgba(124, 255, 164, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#7cffa4',
        pointBorderColor: '#0a0a0f',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false
          },
          grid: {
            color: 'rgba(255,255,255,0.06)'
          },
          angleLines: {
            color: 'rgba(255,255,255,0.06)'
          },
          pointLabels: {
            color: 'rgba(240, 240, 248, 0.7)',
            font: { size: 11, family: "'JetBrains Mono', monospace" }
          }
        }
      }
    }
  });
}

// ==========================================
// VANILLA TILT (bubbles)
// ==========================================
function initTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 15,
      speed: 400,
      glare: false,
      scale: 1.05
    });
  }
}

// ==========================================
// INIT ALL
// ==========================================
function initAnimations() {
  initRadarChart();
  initTilt();
}

// Smooth active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// Add active nav style
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-link.active-nav { color: var(--accent) !important; }`;
document.head.appendChild(styleEl);

// ==========================================
// SCROLL INDICATOR HIDE ON SCROLL
// ==========================================
const scrollInd = document.querySelector('.scroll-indicator');
if (scrollInd) {
  window.addEventListener('scroll', () => {
    scrollInd.style.opacity = window.scrollY > 100 ? '0' : '1';
  });
}

console.log('%c[SUDHEER PORTFOLIO 2026]', 'color: #7cffa4; font-size: 1.2rem; font-weight: bold; font-family: JetBrains Mono;');
console.log('%cHey recruiter! Ping me → venkatasaisudheer03@gmail.com', 'color: #9090a8; font-size: 0.9rem;');