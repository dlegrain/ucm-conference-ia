/* ============================================================
   NAV.JS — Sticky nav, active section highlight, mobile menu
   ============================================================ */

export function initNav() {
  const header       = document.querySelector('header');
  const navLinks     = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const hamburger    = document.querySelector('.hamburger');
  const mobileNav    = document.querySelector('.mobile-nav');
  const sections     = document.querySelectorAll('main section[id]');

  if (!header) return;

  // ── Scroll: header shadow + active link ──────────────────
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    let currentId = '';
    const scrollMid = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();
  updateActiveLink();

  // ── Smooth scroll on click ───────────────────────────────
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const headerHeight = header.offsetHeight;
    const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Close mobile nav if open
    if (mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  // ── Hamburger / Mobile menu ──────────────────────────────
  function openMobileNav() {
    if (!mobileNav || !hamburger) return;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Ouvrir le menu');

    hamburger.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav &&
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
      hamburger.focus();
    }
  });
}
