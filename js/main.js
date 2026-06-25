/**
 * ymsdn-website - Main JavaScript
 * @version 1.0.0
 * @author ymsdn
 */

(function() {
  'use strict';

  /**
   * DOM Ready Handler
   */
  function domReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * App Configuration
   */
  const config = {
    debug: false,
    animationDuration: 300,
    scrollOffset: 80,
  };

  /**
   * Utility: Log debug messages
   */
  function log(...args) {
    if (config.debug) {
      console.log('[main.js]', ...args);
    }
  }

  /**
   * Navigation: Mobile menu toggle
   */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - config.scrollOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /**
   * Scroll-based header effects
   */
  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      header.classList.toggle('is-scrolled', currentScroll > 50);
      header.classList.toggle('is-scrolling-down', currentScroll > lastScroll && currentScroll > 100);
      header.classList.toggle('is-scrolling-up', currentScroll < lastScroll);
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Lazy load images with IntersectionObserver
   */
  function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => observer.observe(img));
  }

  /**
   * Back to top button
   */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Initialize all modules
   */
  function init() {
    log('Initializing...');
    initMobileNav();
    initSmoothScroll();
    initScrollHeader();
    initLazyLoad();
    initBackToTop();
    log('Initialized.');
  }

  // Start when DOM is ready
  domReady(init);

  // Expose public API
  window.YmsdnApp = {
    config,
    domReady,
  };
})();
