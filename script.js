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
const navbar     = document.getElementById('navbar');
const navMenu    = document.getElementById('navMenu');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');
const revealEls  = document.querySelectorAll('.reveal-up, .reveal-left');
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const yearEl     = document.getElementById('year');

/* ─────────────────────────────────────
   1. FOOTER YEAR
───────────────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────
   2. SMOOTH SCROLLING
   Accounts for sticky navbar height
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

      // Close mobile nav if open
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
  onScroll(); // initialise immediately
}

/* ─────────────────────────────────────
   4. HAMBURGER MENU
───────────────────────────────────── */
function openMobileNav() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function initHamburger() {
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* ─────────────────────────────────────
   5. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────── */
function initActiveNav() {
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY  = window.scrollY;
    const offset   = navbar ? navbar.offsetHeight + 80 : 80;
    let current    = '';

    sections.forEach(sec => {
      if (sec.offsetTop - offset <= scrollY) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────
   6. SCROLL-REVEAL (IntersectionObserver)
   Elements need class .reveal-up or .reveal-left
───────────────────────────────────── */
function initScrollReveal() {
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;

        // Stagger siblings: 80ms per index within its parent
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-left')
        );
        const idx = siblings.indexOf(entry.target);

        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('is-visible');

        observer.unobserve(entry.target); // animate once
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────
   7. CONTACT FORM
───────────────────────────────────── */
function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function setError(field, on) {
  field.classList.toggle('error', on);
  if (on) {
    field.addEventListener('input', () => field.classList.remove('error'), { once: true });
  }
}

function shakeBtn(btn) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes _shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-7px)}
      40%{transform:translateX(7px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }`;
  document.head.appendChild(style);
  btn.style.animation = '_shake 0.38s ease';
  btn.addEventListener('animationend', () => {
    btn.style.animation = '';
    style.remove();
  }, { once: true });
}

function initContactForm() {
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fname   = form.querySelector('#fname');
    const lname   = form.querySelector('#lname');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');

    // Validate
    let valid = true;

    [fname, lname].forEach(f => {
      const ok = f.value.trim().length >= 2;
      setError(f, !ok);
      if (!ok) valid = false;
    });

    const emailOk = isValidEmail(email.value.trim());
    setError(email, !emailOk);
    if (!emailOk) valid = false;

    const msgOk = message.value.trim().length >= 10;
    setError(message, !msgOk);
    if (!msgOk) valid = false;

    if (!valid) { shakeBtn(submitBtn); return; }

    // Simulate async send
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = originalText;
      submitBtn.disabled = false;
      form.reset();
      formSuccess.classList.add('visible');

      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1400);
  });
}

/* ─────────────────────────────────────
   8. HERO — STAGGERED ENTRANCE ANIMATION
───────────────────────────────────── */
function initHeroEntrance() {
  const items = [
    document.querySelector('.hero__badge'),
    document.querySelector('.hero__title'),
    document.querySelector('.hero__desc'),
    document.querySelector('.hero__cta'),
  ].filter(Boolean);

  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.75s ease ${250 + i * 140}ms, transform 0.75s ease ${250 + i * 140}ms`;

    // Double rAF to ensure styles applied before transition
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      })
    );
  });
}

/* ─────────────────────────────────────
   9. SERVICE CARD — MOUSE-TRACKING GLOW
   Only on non-touch devices
───────────────────────────────────── */
function initCardGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    .svc-card {
      background-image: radial-gradient(
        220px circle at var(--mx,50%) var(--my,50%),
        rgba(212,175,55,0.05) 0%,
        transparent 100%
      );
    }
  `;
  document.head.appendChild(glowStyle);

  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width  * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top)  / r.height * 100).toFixed(1)}%`);
    });
  });
}

/* ─────────────────────────────────────
   INIT ALL ON DOM READY
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
