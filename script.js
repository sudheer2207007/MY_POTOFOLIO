
// ==========================================
// SHARED & ANALYST MODE LOGIC
// ==========================================

// ScrollReveal
ScrollReveal().reveal('.hero-left', { origin: 'left', distance: '50px', duration: 1000, delay: 300 });
ScrollReveal().reveal('.hero-right', { origin: 'right', distance: '50px', duration: 1000, delay: 500 });
ScrollReveal().reveal('.navbar', { origin: 'top', distance: '20px', duration: 800, delay: 200 });
ScrollReveal().reveal('.about-img', { origin: 'left', distance: '50px', duration: 1000, delay: 200 });
ScrollReveal().reveal('.about-content', { origin: 'right', distance: '50px', duration: 1000, delay: 300 });
ScrollReveal().reveal('.contact-section', { origin: 'bottom', distance: '60px', duration: 1000, delay: 300 });

// Theme toggle
const toggle = document.getElementById('theme-toggle');
const body = document.body;

function loadTheme() {
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    if (toggle) toggle.textContent = "☀️";
  }
}
loadTheme();

if (toggle) {
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
      toggle.textContent = "☀️";
    } else {
      localStorage.setItem("dark-mode", "disabled");
      toggle.textContent = "🌙";
    }
  });
}

// Modal logic for Certificates
function openModal(src) {
  const modal = document.getElementById("certificateModal");
  const modalImg = document.getElementById("modalImage");
  if (modal && modalImg) {
    modal.style.display = "flex";
    modalImg.src = src;
  }
}

function closeModal() {
  const modal = document.getElementById("certificateModal");
  if (modal) modal.style.display = "none";
}

const certModal = document.getElementById("certificateModal");
if (certModal) {
  certModal.addEventListener("click", (e) => {
    if (e.target.id === "certificateModal") {
      certModal.style.display = "none";
    }
  });
}

// Project filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category.split(" ");
      const showCard = filter === "all" || categories.includes(filter);
      if (showCard) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 10);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => card.style.display = "none", 300);
      }
    });
  });
});

// ==========================================
// MULTI-MODE SWITCHER LOGIC
// ==========================================
let gameLoopId;

function switchMode(modeName) {
  // 1. Hide all views
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.remove('active');
    el.classList.add('hidden');
  });

  // 2. Show target view
  const target = document.getElementById(modeName + '-view');
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  // 3. Initialize/Pause Game Loop
  if (modeName === 'game') {
    startGameLoop();
    heroX = 50; heroY = 0; velocityY = 0; // Reset pos
  } else {
    stopGameLoop();
  }

  // 4. Initialize Charts
  if (modeName === 'powerbi') {
    initCharts();
  }

  // Update Buttons
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  // (Optional: Add 'active' to clicked button logic managed by listener below)
}

document.querySelectorAll('.mode-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ==========================================
// PLATFORMER GAME LOGIC 🎮
// ==========================================
const hero = document.getElementById('hero-avatar');
const gameWorld = document.getElementById('game-world');
const scoreDisplay = document.getElementById('score-display');
const hintBox = document.getElementById('interaction-hint');

// Physics Vars
let heroX = 50;
let heroY = 0; // Bottom position relative to ground (110px from HTML bottom)
let velocityY = 0;
let isJumping = false;
let gravity = 0.8;
let moveSpeed = 5;
let score = 0;
let keys = {};
let platforms = []; // Will populate on init
let collectibles = [];
let triggers = [
  { pos: 200, id: 'about', range: 80 },
  { pos: 800, id: 'skills', range: 80 },
  { pos: 1400, id: 'projects', range: 80 },
  { pos: 2000, id: 'certificates', range: 80 },
  { pos: 2600, id: 'contact', range: 80 }
];
let activeTrigger = null;

const gameContent = {
  about: "<h2>🙋‍♂️ About Me</h2><p>I am Sudheer, a Data Scientist converting coffee into code and insights.</p>",
  skills: "<h2>🛠 Skills</h2><ul><li>Python 🐍</li><li>Power BI 📊</li><li>SQL 🗄️</li></ul>",
  projects: "<h2>🚀 Projects</h2><p>IPL Predictor & Churn Analysis.</p>",
  certificates: "<h2>📜 Certificates</h2><p>IBM, AWS, Tata Certified.</p>",
  contact: "<h2>📬 Contact</h2><p>Let's connect!</p>"
};

// Input Handling
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && activeTrigger) {
    showGameModal(activeTrigger);
  }
});

function startGameLoop() {
  if (gameLoopId) return;

  // Parse Elements
  platforms = Array.from(document.querySelectorAll('.game-platform')).map(el => {
    const rect = el.getBoundingClientRect(); // Relative to viewport, need relative to world?
    // Actually, simpler to parse inline styles or assume static for this demo
    // Let's rely on parsing style.left/bottom for "world space"
    return {
      el: el,
      left: parseInt(el.style.left),
      bottom: parseInt(el.style.bottom),
      width: parseInt(el.style.width),
      height: parseInt(el.style.height)
    };
  });

  collectibles = Array.from(document.querySelectorAll('.game-coin')).map(el => ({
    el: el,
    left: parseInt(el.style.left),
    bottom: parseInt(el.style.bottom),
    width: 30, height: 30,
    collected: false
  }));

  gameLoopId = requestAnimationFrame(updateGame);
}

function stopGameLoop() {
  cancelAnimationFrame(gameLoopId);
  gameLoopId = null;
}

function updateGame() {
  if (!document.getElementById('game-view').classList.contains('active')) return;

  // 1. Horizontal Movement
  if (keys['ArrowRight']) {
    heroX += moveSpeed;
    hero.style.transform = 'scaleX(1)';
  }
  if (keys['ArrowLeft']) {
    heroX -= moveSpeed;
    hero.style.transform = 'scaleX(-1)';
    if (heroX < 0) heroX = 0;
  }

  // 2. Vertical Movement (Jump & Gravity)
  if (keys['Space'] && !isJumping) {
    velocityY = 12; // Jump Strength
    isJumping = true;
  }

  heroY += velocityY;
  velocityY -= gravity; // Apply Gravity

  // 3. Collision Detection (Ground & Platforms)
  let onGround = false;

  // Ground Check (Ground is at Y=0 visually, technically bottom: 110px in CSS)
  if (heroY <= 0) {
    heroY = 0;
    velocityY = 0;
    isJumping = false;
    onGround = true;
  }

  // Platform Check
  // Hero Hitbox: X to X+60 (width approx), Y to Y+80 (height approx)
  const heroRect = { l: heroX, r: heroX + 50, b: heroY, t: heroY + 80 };

  platforms.forEach(plat => {
    // Platform Hitbox (World Coords)
    // Platform bottom is Y pos relative to ground 0
    // Actually in CSS .game-platform bottom is px from viewport bottom...
    // Let's standardise: CSS Bottom 110px = Game Y 0.
    // So Platform Y = plat.bottom - 110.
    const platY = plat.bottom - 110;

    // Check if landing on top
    if (velocityY <= 0 && // Falling
      heroRect.b >= platY && heroRect.b <= platY + 15 && // Feet near top
      heroRect.r >= plat.left && heroRect.l <= plat.left + plat.width) { // Horiz overlap
      heroY = platY;
      velocityY = 0;
      isJumping = false;
      onGround = true;
    }
  });

  // 4. Collectibles
  collectibles.forEach(coin => {
    if (coin.collected) return;
    const coinY = coin.bottom - 110;
    // Simple AABB
    if (heroX < coin.left + 30 && heroX + 50 > coin.left &&
      heroY < coinY + 30 && heroY + 80 > coinY) {
      coin.collected = true;
      coin.el.style.display = 'none';
      score += 100;
      scoreDisplay.innerText = score;
    }
  });

  // 5. Triggers (Signposts)
  activeTrigger = null;
  hintBox.style.display = 'none';

  triggers.forEach(trig => {
    if (Math.abs(heroX - trig.pos) < trig.range) {
      activeTrigger = trig.id;
      hintBox.style.display = 'block';
      hintBox.innerText = `PRESS ENTER FOR ${trig.id.toUpperCase()}`;
    }
  });

  // 6. Apply to DOM
  // Default bottom is 110px. So style.bottom = 110 + heroY
  hero.style.bottom = (110 + heroY) + 'px';
  hero.style.left = heroX + 'px';

  // Camera Follow
  if (heroX > 400) {
    gameWorld.style.transform = `translateX(-${heroX - 400}px)`;
  } else {
    gameWorld.style.transform = `translateX(0px)`;
  }

  gameLoopId = requestAnimationFrame(updateGame);
}

// Modal Helpers
function showGameModal(key) {
  const modal = document.getElementById('game-modal');
  const title = document.getElementById('game-modal-title');
  const content = document.getElementById('game-modal-content');
  if (modal && gameContent[key]) {
    title.innerText = key.toUpperCase();
    content.innerHTML = gameContent[key];
    modal.classList.remove('hidden');
    // Pause game input slightly?
    keys = {}; // Reset keys
  }
}
function closeGameModal() {
  const modal = document.getElementById('game-modal');
  if (modal) modal.classList.add('hidden');
}


// ==========================================
// POWER BI CHART LOGIC
// ==========================================
let chartsInitialized = false;

function initCharts() {
  if (chartsInitialized) return;

  // Skills Chart (Bar)
  const ctxSkills = document.getElementById('skillsChart');
  if (ctxSkills) {
    new Chart(ctxSkills, {
      type: 'bar',
      data: {
        labels: ['Python', 'SQL', 'Power BI', 'ML', 'Excel'],
        datasets: [{
          label: 'Proficiency Level (%)',
          data: [90, 85, 95, 80, 88],
          backgroundColor: [
            '#F2C811', '#374649', '#01B8AA', '#FD625E', '#8AD4EB'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

  // Domains Chart (Doughnut)
  const ctxDomains = document.getElementById('domainsChart');
  if (ctxDomains) {
    new Chart(ctxDomains, {
      type: 'doughnut',
      data: {
        labels: ['Data Analysis', 'Web Dev', 'Predictive Modeling', 'Visualization'],
        datasets: [{
          label: 'Projects',
          data: [5, 2, 4, 6],
          backgroundColor: ['#01B8AA', '#374649', '#FD625E', '#F2C811'],
          hoverOffset: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  chartsInitialized = true;
}
