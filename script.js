"use strict";

const body = document.body;

const header =
  document.getElementById("site-header");

const menuButton =
  document.querySelector(".menu-toggle");

const navigation =
  document.getElementById("primary-nav");

const navLinks = [
  ...document.querySelectorAll(
    '.primary-nav a[href^="#"]'
  )
];

const intro =
  document.getElementById("brand-intro");

const cursorGlow =
  document.querySelector(".cursor-glow");

const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

/*
  Show introduction once per browser session.
*/

if (intro) {

  const introSeen =
    sessionStorage.getItem(
      "sclomIntroSeen"
    );

  if (introSeen || reduceMotion) {

    intro.remove();

  } else {

    window.setTimeout(() => {

      intro.classList.add("hide");

      sessionStorage.setItem(
        "sclomIntroSeen",
        "true"
      );

      window.setTimeout(() => {
        intro.remove();
      }, 700);

    }, 1800);

  }

}

/*
  Mobile navigation.
*/

function closeMenu() {

  if (!menuButton || !navigation) {
    return;
  }

  menuButton.classList.remove(
    "active"
  );

  navigation.classList.remove(
    "open"
  );

  header?.classList.remove(
    "menu-active"
  );

  menuButton.setAttribute(
    "aria-expanded",
    "false"
  );

  menuButton.setAttribute(
    "aria-label",
    "Open navigation"
  );

  body.classList.remove(
    "menu-open"
  );

}

function openMenu() {

  if (!menuButton || !navigation) {
    return;
  }

  menuButton.classList.add(
    "active"
  );

  navigation.classList.add(
    "open"
  );

  header?.classList.add(
    "menu-active"
  );

  menuButton.setAttribute(
    "aria-expanded",
    "true"
  );

  menuButton.setAttribute(
    "aria-label",
    "Close navigation"
  );

  body.classList.add(
    "menu-open"
  );

}

menuButton?.addEventListener(
  "click",
  () => {

    const isOpen =
      navigation?.classList.contains(
        "open"
      );

    if (isOpen) {

      closeMenu();

    } else {

      openMenu();

    }

  }
);

navLinks.forEach((link) => {

  link.addEventListener(
    "click",
    closeMenu
  );

});

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeMenu();
    }

  }
);

window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 900) {
      closeMenu();
    }

  }
);

/*
  Header background on scroll.
*/

function updateHeader() {

  header?.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );

}

updateHeader();

window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);

/*
  Active navigation link.
*/

const sections = navLinks
  .map((link) => {

    const target =
      link.getAttribute("href");

    return document.querySelector(
      target
    );

  })
  .filter(Boolean);

if (
  "IntersectionObserver" in window &&
  sections.length
) {

  const sectionObserver =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const current =
            `#${entry.target.id}`;

          navLinks.forEach((link) => {

            link.classList.toggle(
              "active",
              link.getAttribute("href") ===
                current
            );

          });

        });

      },

      {
        rootMargin:
          "-30% 0px -60% 0px",

        threshold: 0.01
      }

    );

  sections.forEach((section) => {

    sectionObserver.observe(
      section
    );

  });

}

/*
  Reveal animations.
*/

const revealItems =
  document.querySelectorAll(
    ".reveal"
  );

if (
  reduceMotion ||
  !("IntersectionObserver" in window)
) {

  revealItems.forEach((item) => {

    item.classList.add(
      "visible"
    );

  });

} else {

  const revealObserver =
    new IntersectionObserver(

      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -40px"
      }

    );

  revealItems.forEach((item) => {

    revealObserver.observe(
      item
    );

  });

}

/*
  Animated counters.
*/

const counters =
  document.querySelectorAll(
    "[data-count]"
  );

function animateCounter(element) {

  const target =
    Number(
      element.dataset.count || 0
    );

  const suffix =
    element.dataset.suffix || "";

  const duration =
    reduceMotion ? 0 : 1200;

  const start =
    performance.now();

  function update(now) {

    const progress =
      duration === 0
        ? 1
        : Math.min(
            (now - start) / duration,
            1
          );

    const eased =
      1 - Math.pow(
        1 - progress,
        3
      );

    element.textContent =
      `${Math.round(
        target * eased
      )}${suffix}`;

    if (progress < 1) {

      requestAnimationFrame(
        update
      );

    }

  }

  requestAnimationFrame(
    update
  );

}

if (
  "IntersectionObserver" in window
) {

  const counterObserver =
    new IntersectionObserver(

      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(
            entry.target
          );

          observer.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.5
      }

    );

  counters.forEach((counter) => {

    counterObserver.observe(
      counter
    );

  });

} else {

  counters.forEach(
    animateCounter
  );

}

/*
  Desktop cursor glow.
*/

if (
  cursorGlow &&
  window
    .matchMedia("(pointer: fine)")
    .matches &&
  !reduceMotion
) {

  window.addEventListener(

    "pointermove",

    (event) => {

      cursorGlow.style.left =
        `${event.clientX}px`;

      cursorGlow.style.top =
        `${event.clientY}px`;

    },

    {
      passive: true
    }

  );

}

/*
  Contact form opens email application.
*/

const contactForm =
  document.getElementById(
    "contact-form"
  );

const formStatus =
  document.getElementById(
    "form-status"
  );

contactForm?.addEventListener(

  "submit",

  (event) => {

    event.preventDefault();

    if (
      !contactForm.checkValidity()
    ) {

      contactForm.reportValidity();

      if (formStatus) {

        formStatus.textContent =
          "Please complete all required fields.";

      }

      return;

    }

    const data =
      new FormData(
        contactForm
      );

    const name =
      String(
        data.get("name") || ""
      ).trim();

    const email =
      String(
        data.get("email") || ""
      ).trim();

    const service =
      String(
        data.get("service") || ""
      ).trim();

    const message =
      String(
        data.get("message") || ""
      ).trim();

    const recipient =
      "naqvishahvlog@gmail.com";

    const subject =
      encodeURIComponent(
        `SCLOM enquiry: ${service}`
      );

    const emailBody =
      encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Service: ${service}\n\n` +
        `Project details:\n${message}`
      );

    if (formStatus) {

      formStatus.textContent =
        "Opening your email application...";

    }

    window.location.href =
      `mailto:${recipient}` +
      `?subject=${subject}` +
      `&body=${emailBody}`;

  }

);

/*
  Current footer year.
*/

const currentYear =
  document.getElementById(
    "current-year"
  );

if (currentYear) {

  currentYear.textContent =
    String(
      new Date().getFullYear()
    );

}
