const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 18);
}

function closeMenu() {
  menuButton.classList.remove('active');
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.classList.toggle('active', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

const form = document.getElementById('project-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('client-name').value.trim();
  const service = document.getElementById('service-needed').value.trim();
  const details = document.getElementById('project-details').value.trim();
  const message = [
    'Hello SCLOM, I would like to discuss a project.',
    '',
    `Name: ${name}`,
    `Service: ${service}`,
    `Project details: ${details}`
  ].join('\n');
  window.open(`https://wa.me/923081600067?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('current-year').textContent = new Date().getFullYear();
