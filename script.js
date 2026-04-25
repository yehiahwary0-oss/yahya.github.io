/* ═══════════════════════════════════════════════════════
   YEHIA.DEV — script.js  v2
   Features:
     1. Smooth scrolling (all anchor links)
     2. Sticky navbar — scroll state + shrink
     3. Mobile hamburger menu
     4. Active nav link on scroll
     5. Scroll-reveal (IntersectionObserver)
     6. Contact form — validation + simulated send
     7. Footer year auto-fill
     8. Service card cursor glow (desktop)
═══════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────
   CONSTANTS & CACHED ELEMENTS
───────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const navMenu     = document.getElementById('navMenu');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const revealEls   = document.querySelectorAll('.reveal-up, .reveal-left');
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const yearEl      = document.getElementById('year');

/* ─────────────────────────────────────
   1. FOOTER YEAR
───────────────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────
   2. SMOOTH SCROLLING
───────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    });
  });
}

/* ─────────────────────────────────────
   3. NAVBAR SCROLL STATE
───────────────────────────────────── */
function initNavbarScroll() {
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 55);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────
   4. HAMBURGER MENU
───────────────────────────────────── */
function openMobileNav() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

function initHamburger() {
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
}

/* ─────────────────────────────────────
   5. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────── */
function initActiveNav() {
  if (!sections.length || !navLinks.length) return;
  const onScroll = () => {
    let current = '';
    const offset = navbar ? navbar.offsetHeight + 80 : 80;
    sections.forEach(sec => {
      if (sec.offsetTop - offset <= window.scrollY) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─────────────────────────────────────
   6. SCROLL-REVEAL
───────────────────────────────────── */
function initScrollReveal() {
  if (!revealEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────
   7. CONTACT FORM (REAL SEND)
───────────────────────────────────── */
function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function initContactForm() {
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const emailField = form.querySelector('#email');
    
    // التحقق البسيط من الإيميل
    if (!isValidEmail(emailField.value.trim())) {
      emailField.classList.add('error');
      return;
    }

    // بدء حالة الإرسال
    submitBtn.disabled = true;
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending...';

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        form.reset();
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 6000);
      } else {
        alert("Oops! There was a problem.");
      }
    })
    .catch(() => alert("Connection error. Check your internet."))
    .finally(() => {
      btnText.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

/* ─────────────────────────────────────
   8. HERO ENTRANCE ANIMATION
───────────────────────────────────── */
function initHeroEntrance() {
  const items = document.querySelectorAll('.hero__badge, .hero__title, .hero__desc, .hero__cta');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 150);
  });
}

/* ─────────────────────────────────────
   9. SERVICE CARD GLOW
───────────────────────────────────── */
function initCardGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    });
  });
}

/* ─────────────────────────────────────
   INIT ALL FUNCTIONS
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initNavbarScroll();
  initHamburger();
  initActiveNav();
  initScrollReveal();
  initContactForm();
  initHeroEntrance();
  initCardGlow();
});