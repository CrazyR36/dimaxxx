'use strict';

/* ===========================
   HERO CANVAS – Sternenhimmel
   (passt zum Produkt LED-Sternenhimmel)
=========================== */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createStar() {
    const isGold = Math.random() < 0.35;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: randomBetween(0.3, 1.8),
      alpha: randomBetween(0.1, 0.9),
      speed: randomBetween(0.002, 0.008),
      phase: Math.random() * Math.PI * 2,
      color: isGold
        ? `rgba(${200 + Math.random()*40}, ${150 + Math.random()*40}, ${40 + Math.random()*40}`
        : `rgba(${200 + Math.random()*55}, ${200 + Math.random()*55}, ${200 + Math.random()*55}`,
    };
  }

  function initStars() {
    const count = Math.floor((W * H) / 5000);
    stars = Array.from({ length: Math.min(count, 220) }, createStar);
  }

  // Gelegentliche Shooting Stars
  let shootingStars = [];

  function addShootingStar() {
    shootingStars.push({
      x: randomBetween(W * 0.1, W * 0.9),
      y: randomBetween(H * 0.05, H * 0.4),
      len: randomBetween(80, 180),
      angle: randomBetween(0.3, 0.7),
      speed: randomBetween(8, 16),
      alpha: 1,
      decay: randomBetween(0.015, 0.03),
      isGold: Math.random() < 0.5,
    });
  }

  let shootTimer = 0;
  let lastTime = 0;

  function draw(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 16, 3);
    lastTime = timestamp;
    shootTimer += dt;

    ctx.clearRect(0, 0, W, H);

    // Sterne
    stars.forEach(s => {
      s.phase += s.speed;
      const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}, ${a})`;
      ctx.fill();

      // Größere Sterne mit Leuchten
      if (s.r > 1.3) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}, ${a * 0.08})`;
        ctx.fill();
      }
    });

    // Shooting Stars
    if (shootTimer > 200) {
      shootTimer = 0;
      if (Math.random() < 0.25) addShootingStar();
    }

    shootingStars = shootingStars.filter(ss => ss.alpha > 0);
    shootingStars.forEach(ss => {
      ss.x += Math.cos(ss.angle) * ss.speed * dt;
      ss.y += Math.sin(ss.angle) * ss.speed * dt;
      ss.alpha -= ss.decay * dt;

      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      const col = ss.isGold ? '201,168,76' : '220,220,220';
      grad.addColorStop(0, `rgba(${col},${ss.alpha})`);
      grad.addColorStop(1, `rgba(${col},0)`);

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  initStars();
  animId = requestAnimationFrame(draw);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); initStars(); }, 200);
  }, { passive: true });
})();

/* ===========================
   HEADER SCROLL
=========================== */
const header = document.getElementById('header');

function handleScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ===========================
   MOBILE NAV
=========================== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

/* ===========================
   SCROLL ANIMATIONS
=========================== */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Gold-Line animieren
      const line = entry.target.querySelector?.('.gold-line');
      if (line) line.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(num => {
        animateCounter(num, parseInt(num.dataset.target), num.dataset.suffix || '');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===========================
   CONTACT FORM
=========================== */
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Wird gesendet…';

    setTimeout(() => {
      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    }, 1200);
  });
}

/* ===========================
   COOKIE BANNER
=========================== */
const cookieBanner = document.getElementById('cookie-banner');

if (cookieBanner && !localStorage.getItem('dimaxx_cookie_consent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 1800);
}

function setCookieConsent(value) {
  localStorage.setItem('dimaxx_cookie_consent', value);
  if (cookieBanner) cookieBanner.classList.remove('show');
}

const acceptBtn  = document.getElementById('cookie-accept');
const declineBtn = document.getElementById('cookie-decline');
if (acceptBtn)  acceptBtn.addEventListener('click', ()  => setCookieConsent('accepted'));
if (declineBtn) declineBtn.addEventListener('click', () => setCookieConsent('declined'));

/* ===========================
   SMOOTH ANCHORS
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV HIGHLIGHT
=========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold-light)' : '';
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
