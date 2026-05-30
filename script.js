/* ─── Theme Toggle ─── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ─── Hamburger Menu ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ─── Active Nav Link on Scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

/* ─── Scroll Reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Navbar scroll shadow ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25)';
  } else {
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });

/* ─── Smooth scroll for nav links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Contact Form ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    // If running locally from file:// protocol, standard submission is used to bypass CORS blocks
    if (window.location.protocol === 'file:') {
      return;
    }
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        btn.textContent = 'Sent! ✓';
        btn.style.background = '#4caf82';
        form.reset();
      } else {
        btn.textContent = 'Error! ✗';
        btn.style.background = '#f44336';
      }
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    })
    .catch(error => {
      btn.textContent = 'Error! ✗';
      btn.style.background = '#f44336';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  });
}

/* ─── Skill tag hover ripple ─── */
document.querySelectorAll('.skill-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.06)';
  });
  tag.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ─── Typewriter effect for hero subtitle ─── */
const dynamicText = document.getElementById('dynamicText');
const phrases = [
  'Full-Stack Developer',
  'AI/ML Developer',
  'Android & iOS App Developer'
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function type() {
  if (!dynamicText) return;
  const currentPhrase = phrases[phraseIdx];
  if (isDeleting) {
    dynamicText.textContent = currentPhrase.substring(0, charIdx - 1);
    charIdx--;
  } else {
    dynamicText.textContent = currentPhrase.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 45 : 85;

  if (!isDeleting && charIdx === currentPhrase.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typeSpeed = 400;
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  if (dynamicText) type();
});
