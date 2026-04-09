/* ============================================================
   MODELS.JS — Animated rating bars on scroll
   ============================================================ */

export function initModels() {
  // ── Context window bars ──────────────────────────────────
  const contextBars    = document.querySelectorAll('.context-bar-fill');
  // ── Model rating bars ────────────────────────────────────
  const ratingBars     = document.querySelectorAll('.rating-bar');
  // ── Star ratings ─────────────────────────────────────────
  const starContainers = document.querySelectorAll('.star-rating');

  if (!contextBars.length && !ratingBars.length) return;

  // ── IntersectionObserver for context bars ────────────────
  const contextObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateContextBar(entry.target);
          contextObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  contextBars.forEach(bar => contextObserver.observe(bar));

  function animateContextBar(bar) {
    const targetWidth = bar.getAttribute('data-width') || '0';
    // Small delay for visual delight
    setTimeout(() => {
      bar.style.width = targetWidth + '%';
    }, 150);
  }

  // ── IntersectionObserver for rating bars ─────────────────
  const ratingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateRatingBar(entry.target);
          ratingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  ratingBars.forEach(bar => ratingObserver.observe(bar));

  function animateRatingBar(bar) {
    const targetWidth = bar.getAttribute('data-width') || '0';
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, 100);
    });
  }

  // ── Animate stars sequentially ────────────────────────────
  const starObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStars(entry.target);
          starObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  starContainers.forEach(container => starObserver.observe(container));

  function animateStars(container) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.style.opacity = '0';
      star.style.transform = 'scale(0) rotate(-30deg)';
      star.style.transition = 'none';

      setTimeout(() => {
        star.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        star.style.opacity   = '1';
        star.style.transform = 'scale(1) rotate(0deg)';
      }, index * 100 + 200);
    });
  }

  // ── Model card glow on hover ──────────────────────────────
  const modelCards = document.querySelectorAll('.model-card');

  modelCards.forEach(card => {
    const glowColor = card.getAttribute('data-glow') || 'rgba(79, 142, 247, 0.2)';

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 8px 40px ${glowColor}`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
}
