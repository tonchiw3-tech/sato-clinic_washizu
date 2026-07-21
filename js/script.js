document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('.reveal-section'));
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const globalNav = document.querySelector('.global-nav');
  const galleryCarousel = document.querySelector('[data-carousel="clinic-gallery"]');
  const galleryTrack = galleryCarousel?.querySelector('.gallery-track');

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

  if (galleryCarousel && galleryTrack) {
    const slides = Array.from(galleryTrack.querySelectorAll('img'));
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    dots.setAttribute('aria-label', '\u9662\u5185\u306e\u5199\u771f\u3092\u5207\u308a\u66ff\u3048\u308b');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let deltaX = 0;
    let activePointerId = null;
    let activeTouchId = null;

    const clampIndex = (value) => Math.max(0, Math.min(slides.length - 1, value));

    const updateDots = () => {
      dotButtons.forEach((button, index) => {
        button.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    };

    const render = (animate = true) => {
      if (!mobileQuery.matches) {
        galleryTrack.classList.remove('is-dragging');
        galleryTrack.style.transform = '';
        galleryTrack.style.transition = '';
        return;
      }

      galleryTrack.classList.add('is-carousel-active');
      galleryTrack.classList.toggle('is-dragging', isDragging);
      galleryTrack.style.transition = animate ? '' : 'none';
      galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const setIndex = (value, animate = true) => {
      currentIndex = clampIndex(value);
      deltaX = 0;
      render(animate);
    };

    const dotButtons = slides.map((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${index + 1}\u679a\u76ee\u306e\u5199\u771f\u3092\u8868\u793a`);
      button.addEventListener('click', () => {
        setIndex(index);
      });
      dots.appendChild(button);
      return button;
    });

    galleryCarousel.insertAdjacentElement('afterend', dots);

    const enableCarousel = () => {
      dots.hidden = false;
      setIndex(currentIndex, false);
    };

    const disableCarousel = () => {
      isDragging = false;
      activePointerId = null;
      deltaX = 0;
      galleryTrack.classList.remove('is-carousel-active', 'is-dragging');
      galleryTrack.style.transform = '';
      galleryTrack.style.transition = '';
      dots.hidden = true;
      updateDots();
    };

    galleryCarousel.addEventListener('pointerdown', (event) => {
      if (!mobileQuery.matches || event.pointerType === 'mouse') {
        return;
      }

      isDragging = true;
      startX = event.clientX;
      deltaX = 0;
      activePointerId = event.pointerId;
      galleryCarousel.setPointerCapture(event.pointerId);
      render(false);
    });

    galleryCarousel.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== activePointerId || !mobileQuery.matches) {
        return;
      }

      deltaX = event.clientX - startX;
      galleryTrack.style.transform = `translateX(calc(-${currentIndex * 100}% + ${deltaX}px))`;
    });

    galleryCarousel.addEventListener('touchstart', (event) => {
      if (!mobileQuery.matches || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      isDragging = true;
      startX = touch.clientX;
      deltaX = 0;
      activeTouchId = touch.identifier;
      render(false);
    }, { passive: true });

    galleryCarousel.addEventListener('touchmove', (event) => {
      if (!isDragging || !mobileQuery.matches || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      if (touch.identifier !== activeTouchId) {
        return;
      }

      event.preventDefault();
      deltaX = touch.clientX - startX;
      galleryTrack.style.transform = `translateX(calc(-${currentIndex * 100}% + ${deltaX}px))`;
    }, { passive: false });

    const finishDrag = (event) => {
      if (!isDragging) {
        return;
      }

      if (event.type === 'pointerup' || event.type === 'pointercancel') {
        if (event.pointerId !== activePointerId) {
          return;
        }
      }

      const threshold = 50;
      if (deltaX < -threshold) {
        setIndex(currentIndex + 1);
      } else if (deltaX > threshold) {
        setIndex(currentIndex - 1);
      } else {
        setIndex(currentIndex);
      }

      isDragging = false;
      activePointerId = null;
      activeTouchId = null;
      deltaX = 0;
      galleryTrack.classList.remove('is-dragging');
    };

    galleryCarousel.addEventListener('pointerup', finishDrag);
    galleryCarousel.addEventListener('pointercancel', finishDrag);
    galleryCarousel.addEventListener('touchend', finishDrag);
    galleryCarousel.addEventListener('touchcancel', finishDrag);

    mobileQuery.addEventListener('change', () => {
      if (mobileQuery.matches) {
        enableCarousel();
      } else {
        disableCarousel();
      }
    });

    if (mobileQuery.matches) {
      enableCarousel();
    } else {
      disableCarousel();
    }
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
