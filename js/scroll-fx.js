/* ============================================================
   LWS — scroll-fx.js
   Hero parallax + section fade-in
   Pure vanilla JS | No dependencies | Drop-in for any page
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. INJECT FADE-IN CSS ─────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .lws-fade {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .lws-fade.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* ── 2. SELECTORS TO OBSERVE ───────────────────────────── */
  const FADE_SELECTORS = [
    '.show-card',
    '.fan-quote',
    '.member-row',
    '.video-card',
    '.section-title',
    '.section-eyebrow',
    '.quotes-title',
    '.epk-stat',
    '.testimonial-card',
    '.dl-card',
    '.about-intro-block',
    '.meet-heading',
    '.memoriam-inner',
    '.epk-lede',
    '.media-intro',
    '.tour-intro',
    '.contact-inner',
    '.cta-inner',
    /* LegacyTCP-specific */
    '.mega-col',
    '.service-card',
    '.team-card',
    '.two-col',
    '.footer-col',
    '.commitment-inner',
    '.blog-card'
  ].join(',');

  /* ── 3. TAG ELEMENTS + STAGGER GRID CHILDREN ──────────── */
  function tagElements() {
    const els = document.querySelectorAll(FADE_SELECTORS);
    if (!els.length) return;

    els.forEach(function (el) {
      el.classList.add('lws-fade');
    });

    /* Stagger siblings that share the same parent (grids, rows) */
    const parents = new Set();
    els.forEach(function (el) { parents.add(el.parentElement); });

    parents.forEach(function (parent) {
      if (!parent) return;
      const children = Array.from(parent.querySelectorAll('.lws-fade'));
      if (children.length < 2) return;
      children.forEach(function (child, i) {
        const delay = Math.min(i, 3) * 0.1; /* cap at 4th child = 0.3s */
        child.style.transitionDelay = delay + 's';
      });
    });
  }

  /* ── 4. INTERSECTION OBSERVER ──────────────────────────── */
  function initObserver() {
    /* Fallback: no IntersectionObserver support */
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.lws-fade').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* fire once only */
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.lws-fade').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 5. SECTION VIDEO BACKGROUND ───────────────────────── */
  function initSectionVideo() {
    const firstWhiteSection = Array.from(document.querySelectorAll('section.section, section.section-offwhite'))
      .find(function (section) {
        return !section.classList.contains('section-navy') && !section.classList.contains('why-section') && !section.classList.contains('team-section') && !section.classList.contains('disclaimer');
      });

    if (!firstWhiteSection || firstWhiteSection.querySelector('.section-background-video')) {
      return;
    }

    firstWhiteSection.classList.add('section-video-bg');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.src = '/video/ani-bg.mp4';
    video.className = 'section-background-video';
    video.setAttribute('aria-hidden', 'true');
    firstWhiteSection.prepend(video);
  }

  /* ── 6. HERO PARALLAX ──────────────────────────────────── */
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return; /* no hero on this page — bail silently */

    let ticking = false;

    function applyParallax() {
      const scrollY = window.pageYOffset;
      heroBg.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });

    /* Set initial position on load */
    applyParallax();
  }

  /* ── 7. INIT ───────────────────────────────────────────── */
  function init() {
    tagElements();
    initObserver();
    initSectionVideo();
    initParallax();
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); /* DOM already parsed (script at bottom of body) */
  }

})();
