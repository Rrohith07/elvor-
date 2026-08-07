const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const topButton = document.querySelector('.to-top');

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

function updateScrollState() {
  header?.classList.toggle('scrolled', window.scrollY > 30);
  topButton?.classList.toggle('visible', window.scrollY > 600);
}
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  toggle?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const form = document.querySelector('#project-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const note = form.querySelector('.form-note');
  note.textContent = 'Demo form only. Connect a form service before publishing.';
});

// Smooth custom cursor: instant dot + lagging ring (desktop/fine pointers only)
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (finePointer && !reducedMotion) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const placeDot = () => {
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  };

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    placeDot();
    dot.classList.add('is-visible');
    ring.classList.add('is-visible');
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  });

  window.addEventListener('mouseenter', () => {
    dot.classList.add('is-visible');
    ring.classList.add('is-visible');
  });

  const hoverTargets = 'a, button, input, textarea, select, .service-item, .project-card, .pill-button, .circle-link, .contact-title';
  document.addEventListener('mouseover', (event) => {
    if (event.target.closest(hoverTargets)) ring.classList.add('is-active');
  });

  document.addEventListener('mouseout', (event) => {
    if (event.target.closest(hoverTargets)) ring.classList.remove('is-active');
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };

  placeDot();
  animateCursor();
}
