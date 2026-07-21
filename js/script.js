document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('.reveal-section'));
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const globalNav = document.querySelector('#global-nav');

  if (header && menuToggle && globalNav) {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const openLabel = '\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f';
    const closeLabel = '\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b';

    const closeMenu = () => {
      header.classList.remove('is-nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', openLabel);
    };

    const toggleMenu = () => {
      const isOpen = header.classList.toggle('is-nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
    };

    menuToggle.addEventListener('click', () => {
      if (!mobileQuery.matches) {
        return;
      }

      toggleMenu();
    });

    globalNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileQuery.matches) {
          closeMenu();
        }
      });
    });

    mobileQuery.addEventListener('change', (event) => {
      if (!event.matches) {
        closeMenu();
      }
    });
  }

  if (targets.length) {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => {
        target.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    });

    targets.forEach((target) => {
      observer.observe(target);
    });
  }
});
