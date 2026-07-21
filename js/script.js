document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('.reveal-section'));

  if (!targets.length) {
    return;
  }

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
});
