'use strict';

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

const navLinks = [
  ...document.querySelectorAll('.primary-nav a[href^="#"]')
];

const backToTop = document.querySelector('.back-to-top');
const cursorGlow = document.querySelector('.cursor-glow');
const projectForm = document.querySelector('#project-form');
const formNote = document.querySelector('#form-note');

const whatsappNumber = '923081600067';

/* =========================
   Mobile Navigation
========================= */

function closeMenu() {
  nav?.classList.remove('open');

  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');

  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');

  menuToggle.setAttribute('aria-expanded', String(isOpen));

  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation' : 'Open navigation'
  );

  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

/* =========================
   Header and Back-to-Top
========================= */

function updateHeader() {
  const isScrolled = window.scrollY > 24;

  header?.classList.toggle('scrolled', isScrolled);

  backToTop?.classList.toggle(
    'visible',
    window.scrollY > 600
  );
}

window.addEventListener('scroll', updateHeader, {
  passive: true
});

updateHeader();

backToTop?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* =========================
   Cursor Glow Effect
========================= */

if (
  cursorGlow &&
  window.matchMedia('(pointer: fine)').matches
) {
  window.addEventListener(
    'pointermove',
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    {
      passive: true
    }
  );
}

/* =========================
   Scroll Reveal Animations
========================= */

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.13,
    rootMargin: '0px 0px -40px'
  }
);

document
  .querySelectorAll('.reveal')
  .forEach((element, index) => {
    element.style.transitionDelay =
      `${Math.min(index % 4, 3) * 70}ms`;

    revealObserver.observe(element);
  });

/* =========================
   Active Navigation Links
========================= */

const pageSections = [
  ...document.querySelectorAll('main section[id]')
];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentSectionId = entry.target.id;

      navLinks.forEach((link) => {
        const linkSection =
          link.getAttribute('href');

        link.classList.toggle(
          'active',
          linkSection === `#${currentSectionId}`
        );
      });
    });
  },
  {
    threshold: 0.42,
    rootMargin: '-70px 0px -35% 0px'
  }
);

pageSections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================
   Animated Statistics
========================= */

const statItems =
  document.querySelectorAll('[data-count]');

let countersStarted = false;

function animateCounter(element) {
  const target =
    Number(element.dataset.count || 0);

  const suffix =
    element.dataset.suffix || '';

  const duration = 1500;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue =
      Math.round(target * easedProgress);

    element.textContent =
      `${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const statsSection =
  document.querySelector('.stats-section');

if (statsSection) {
  const counterObserver =
    new IntersectionObserver(
      (entries, observer) => {
        const sectionIsVisible =
          entries.some(
            (entry) => entry.isIntersecting
          );

        if (
          sectionIsVisible &&
          !countersStarted
        ) {
          countersStarted = true;

          statItems.forEach(animateCounter);

          observer.disconnect();
        }
      },
      {
        threshold: 0.4
      }
    );

  counterObserver.observe(statsSection);
}

/* =========================
   Portfolio Filters
========================= */

const filterButtons =
  document.querySelectorAll('.filter-btn');

const projectCards =
  document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter =
      button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove('active');
    });

    button.classList.add('active');

    projectCards.forEach((card) => {
      const projectCategory =
        card.dataset.category;

      const matchesFilter =
        selectedFilter === 'all' ||
        projectCategory === selectedFilter;

      card.classList.toggle(
        'hidden',
        !matchesFilter
      );

      if (matchesFilter) {
        card.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(14px)'
            },
            {
              opacity: 1,
              transform: 'translateY(0)'
            }
          ],
          {
            duration: 330,
            easing: 'ease-out'
          }
        );
      }
    });
  });
});

/* =========================
   Testimonial Slider
========================= */

const testimonialCards = [
  ...document.querySelectorAll(
    '.testimonial-card'
  )
];

const dotsContainer =
  document.querySelector('.slider-dots');

const previousButton =
  document.querySelector('.slider-btn.prev');

const nextButton =
  document.querySelector('.slider-btn.next');

let currentTestimonial = 0;
let sliderTimer;

function showTestimonial(index) {
  if (!testimonialCards.length) {
    return;
  }

  currentTestimonial =
    (index + testimonialCards.length) %
    testimonialCards.length;

  testimonialCards.forEach(
    (card, cardIndex) => {
      card.classList.toggle(
        'active',
        cardIndex === currentTestimonial
      );
    }
  );

  dotsContainer
    ?.querySelectorAll('button')
    .forEach((dot, dotIndex) => {
      const isCurrent =
        dotIndex === currentTestimonial;

      dot.classList.toggle(
        'active',
        isCurrent
      );

      dot.setAttribute(
        'aria-current',
        isCurrent ? 'true' : 'false'
      );
    });
}

function resetSliderTimer() {
  window.clearInterval(sliderTimer);

  sliderTimer = window.setInterval(() => {
    showTestimonial(
      currentTestimonial + 1
    );
  }, 6500);
}

if (
  dotsContainer &&
  testimonialCards.length
) {
  testimonialCards.forEach(
    (_, index) => {
      const dot =
        document.createElement('button');

      dot.type = 'button';

      dot.setAttribute(
        'aria-label',
        `Show testimonial ${index + 1}`
      );

      dot.addEventListener('click', () => {
        showTestimonial(index);
        resetSliderTimer();
      });

      dotsContainer.appendChild(dot);
    }
  );

  showTestimonial(0);
  resetSliderTimer();
}

previousButton?.addEventListener(
  'click',
  () => {
    showTestimonial(
      currentTestimonial - 1
    );

    resetSliderTimer();
  }
);

nextButton?.addEventListener(
  'click',
  () => {
    showTestimonial(
      currentTestimonial + 1
    );

    resetSliderTimer();
  }
);

/* =========================
   WhatsApp Contact Form
========================= */

projectForm?.addEventListener(
  'submit',
  (event) => {
    event.preventDefault();

    const name = document
      .querySelector('#name')
      ?.value.trim();

    const email = document
      .querySelector('#email')
      ?.value.trim();

    const service = document
      .querySelector('#service')
      ?.value.trim();

    const details = document
      .querySelector('#details')
      ?.value.trim();

    if (!name || !service || !details) {
      if (formNote) {
        formNote.textContent =
          'Please enter your name, select a service and add project details.';

        formNote.classList.add('error');
      }

      return;
    }

    if (formNote) {
      formNote.classList.remove('error');

      formNote.textContent =
        'Opening WhatsApp with your project details…';
    }

    const message = [
      'Hello SCLOM, I would like to discuss a project.',
      '',
      `Name: ${name}`,
      `Email: ${email || 'Not provided'}`,
      `Service: ${service}`,
      `Project details: ${details}`
    ].join('\n');

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }
);

/* =========================
   Automatic Copyright Year
========================= */

const yearElement =
  document.querySelector('#year');

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}
