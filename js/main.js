/* ============================================================
   MAIN.JS — Init, scroll progress, IntersectionObserver
   ============================================================ */

import { initNav }    from './nav.js';
import { initNotes }  from './notes.js';
import { initModels } from './models.js';
import { initQuiz }   from './quiz.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──────────────────────────────────
  const progressBar = document.getElementById('progress-bar');

  if (progressBar) {
    function updateProgress() {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const percent      = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent.toFixed(2) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ── Intersection Observer — Reveal Animations ────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ── Flip Cards ──────────────────────────────────────────
  // Click-to-flip for mobile (and desktop as alternative to hover)
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Cliquez pour retourner la carte : ${card.querySelector('.flip-card-title')?.textContent || ''}`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // ── Pipeline Steps Animation ─────────────────────────────
  const pipelineSteps = document.querySelectorAll('.pipeline-step');

  if (pipelineSteps.length) {
    const pipelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.pipeline-step');
            steps.forEach((step, i) => {
              setTimeout(() => {
                step.style.opacity   = '1';
                step.style.transform = 'translateY(0)';
              }, i * 120);
            });
            pipelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const pipeline = document.querySelector('.pipeline');
    if (pipeline) {
      pipelineSteps.forEach(step => {
        step.style.opacity   = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      pipelineObserver.observe(pipeline);
    }
  }

  // ── Hero Particles ───────────────────────────────────────
  createParticles();

  function createParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const count = 28;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size     = Math.random() * 2 + 1;
      const left     = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay    = Math.random() * 8;
      const colors   = [
        'rgba(79, 142, 247, 0.7)',
        'rgba(124, 58, 237, 0.6)',
        'rgba(6, 182, 212, 0.7)',
        'rgba(16, 185, 129, 0.5)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        background: ${color};
        animation: particleFloat ${duration}s ${delay}s linear infinite;
        border-radius: 50%;
        position: absolute;
      `;

      container.appendChild(particle);
    }
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href   = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = document.querySelector('header')?.offsetHeight || 68;
      window.scrollTo({
        top: target.offsetTop - headerH - 8,
        behavior: 'smooth'
      });
    });
  });

  // ── Initialize Modules ───────────────────────────────────
  initNav();
  initNotes();
  initModels();
  initQuiz();

  // ── Hero entrance animation fix ──────────────────────────
  // Ensure hero elements animate even if already in view
  setTimeout(() => {
    document.querySelectorAll('.hero-content .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  // ── Tooltip on copy-tip notification ────────────────────
  // Show a brief toast notification
  window.showToast = function(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)'};
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 0.88rem;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      opacity: 0;
      transition: all 0.3s ease;
      white-space: nowrap;
      font-family: var(--font-body);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  console.log('%c🤖 AI-Shift.be — Conférence UCM', 'color: #4f8ef7; font-size: 16px; font-weight: bold;');
  console.log('%cpar Diederick Legrain', 'color: #94a3b8; font-size: 12px;');
});
