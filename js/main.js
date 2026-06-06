'use strict';

/* ===========================
   HEADER SCROLL
=========================== */
const header = document.getElementById('header');

function handleScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleScroll, { passive: true });

/* ===========================
   MOBILE NAV
=========================== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('active');
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
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-number[data-target]');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target);
        const suffix = num.dataset.suffix || '';
        animateCounter(num, target, suffix);
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
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Wird gesendet…';

    // Simulate send (replace with actual backend/formspree endpoint)
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

function showCookieBanner() {
  if (!cookieBanner) return;
  if (!localStorage.getItem('dimaxx_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
  }
}

function acceptCookies() {
  localStorage.setItem('dimaxx_cookie_consent', 'accepted');
  cookieBanner.classList.remove('show');
}

function declineCookies() {
  localStorage.setItem('dimaxx_cookie_consent', 'declined');
  cookieBanner.classList.remove('show');
}

showCookieBanner();

const acceptBtn = document.getElementById('cookie-accept');
const declineBtn = document.getElementById('cookie-decline');
if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
if (declineBtn) declineBtn.addEventListener('click', declineCookies);

/* ===========================
   SMOOTH ANCHOR LINKS
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV LINK HIGHLIGHT
=========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--gold)' : '';
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
