/* =========================================================
   FUAD AL MAIMUN — PORTFOLIO SCRIPT
   Vanilla JS, no dependencies. Organized by feature so each
   piece can be lifted out independently if reused elsewhere.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Loader ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('loaded'), 700);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader && loader.classList.add('loaded'), 700);
  }

  /* ---------------- Scroll progress bar ---------------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------------- Navbar scrolled state + active link ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');

  function onScrollNav() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Theme switcher (dark/light, persisted) ---------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (next === 'dark') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', next);
    });
  }

  /* ---------------- Custom cursor ---------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(hover:hover)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ---------------- Particle background (subtle, canvas) ---------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function initParticles() {
      const count = Math.min(60, Math.floor((w * h) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.15
      }));
    }
    function isLight() { return document.documentElement.getAttribute('data-theme') === 'light'; }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const color = isLight() ? '20,22,45' : '200,210,255';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- Typing effect (hero terminal motto) ---------------- */
  const typingTarget = document.getElementById('typing-target');
  if (typingTarget) {
    const phrases = [
      '"code with care."',
      '"ship it responsive."',
      '"learn in public."'
    ];
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typingTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typingTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    if (prefersReducedMotion) {
      typingTarget.textContent = phrases[0];
    } else {
      typeLoop();
    }
  }

  /* ---------------- Counter animation ---------------- */
  const counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

/* ---------------- Skills tabs & Animated skill bars ---------------- */
const skillTabs = document.querySelectorAll('.skills-tab');
const skillsCurrent = document.getElementById('skills-current');
const skillsLearning = document.getElementById('skills-learning');

function animateVisibleSkillBars() {
  const activePanel = document.querySelector('.skills-grid:not([hidden])');
  if (!activePanel) return;

  const fills = activePanel.querySelectorAll('.skill-bar-fill');
  fills.forEach(fill => {
    const level = fill.dataset.level || '0';
    requestAnimationFrame(() => {
      fill.style.width = `${level}%`;
    });
  });
}

skillTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();

    skillTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const targetTab = tab.getAttribute('data-tab');

    if (targetTab === 'learning') {
      skillsCurrent.setAttribute('hidden', 'true');
      skillsLearning.removeAttribute('hidden');
    } else {
      skillsLearning.setAttribute('hidden', 'true');
      skillsCurrent.removeAttribute('hidden');
    }

    animateVisibleSkillBars();
  });
});

// Scroll Intersection Observer for Skills
if ('IntersectionObserver' in window) {
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateVisibleSkillBars();
          skillIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillIO.observe(skillsSection);
  }
} else {
  animateVisibleSkillBars();
}
  

  /* ---------------- Tech stack marquee ---------------- */
  const stackTrack = document.getElementById('stack-track');
  if (stackTrack) {
    const stackItems = [
      { name: 'HTML5', color: '#E44D26' },
      { name: 'CSS', color: '#264DE4' },
      { name: 'JavaScript', color: '#F0DB4F' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Tailwind CSS', color: '#06B6D4' },
      { name: 'Git', color: '#F05032' },
      { name: 'GitHub', color: '#8B93A7' },
      { name: 'VS Code', color: '#007ACC' },
      { name: 'Flexbox', color: '#22D3EE' },
      { name: 'CSS Grid', color: '#22D3EE' },
      { name: 'React (learning)', color: '#61DAFB' },
      { name: 'Next.js (learning)', color: '#007ACC' },
      { name: 'Node.js (learning)', color: '#68A063' },
      { name: 'MongoDB (learning)', color: '#47A248' },
      { name: 'REST API (learning)', color: '#22D3EE' }
    ];
    function buildChip(item) {
      const chip = document.createElement('div');
      chip.className = 'stack-chip glass';
      chip.innerHTML = `<span style="width:10px;height:10px;border-radius:50%;background:${item.color};display:inline-block;"></span>${item.name}`;
      return chip;
    }
    // duplicate list for seamless marquee loop
    [...stackItems, ...stackItems].forEach(item => stackTrack.appendChild(buildChip(item)));
  }

  /* ---------------- Button ripple ---------------- */
  document.querySelectorAll('[data-ripple], .btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = this.style.position || 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- Project filter + search ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('no-results');
  let activeFilter = 'all';

  function applyProjectFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    projectCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount++;
    });
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyProjectFilters();
    });
  });
  if (searchInput) searchInput.addEventListener('input', applyProjectFilters);

  /* ---------------- Project modal ---------------- */
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.project-details-btn');
  let lastFocusedEl = null;

  function pipeListToItems(str) {
    return (str || '').split('|').filter(Boolean).map(item => `<li>${item}</li>`).join('');
  }
  function csvToPills(str) {
    return (str || '').split(',').filter(Boolean).map(item => `<span class="stack-pill">${item.trim()}</span>`).join('');
  }

  function openModal(card) {
    lastFocusedEl = document.activeElement;
    document.getElementById('modal-title').textContent = card.dataset.title || '';
    document.getElementById('modal-desc').textContent = card.dataset.desc || '';
    document.getElementById('modal-features').innerHTML = pipeListToItems(card.dataset.features);
    document.getElementById('modal-stack').innerHTML = csvToPills(card.dataset.stack);
    document.getElementById('modal-challenges').textContent = card.dataset.challenges || '';
    document.getElementById('modal-learned').textContent = card.dataset.learned || '';
    document.getElementById('modal-demo').href = card.dataset.demo || '#';
    document.getElementById('modal-repo').href = card.dataset.repo || '#';
    const thumbText = card.querySelector('.thumb-browser-body')?.textContent || '--';
    document.getElementById('modal-thumb-text').textContent = thumbText;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.closest('.project-card')));
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------------- Contact form (client-side validation + mailto) ---------------- */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const fields = ['name', 'email', 'subject', 'message'];
      fields.forEach(field => {
        const input = document.getElementById(field);
        const errorEl = document.getElementById('err-' + field);
        errorEl.textContent = '';
        if (!input.value.trim()) {
          errorEl.textContent = 'This field is required.';
          valid = false;
        } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          errorEl.textContent = 'Please enter a valid email address.';
          valid = false;
        }
      });
      if (!valid) return;

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoLink = `mailto:fuadmaymun0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      formSuccess.classList.add('show');
      window.location.href = mailtoLink;
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Download CV / LinkedIn placeholders ---------------- */
  const cvButtons = ['cta-download-cv', 'footer-cv'];
  cvButtons.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => {
      e.preventDefault();
      alert('Add your CV file (e.g. /assets/Fuad-Al-Maimun-CV.pdf) and link it to this button.');
    });
  });
  ['linkedin-link', 'linkedin-link-footer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => {
      if (el.getAttribute('href') === '#') {
        e.preventDefault();
        alert('Add your LinkedIn profile URL to this button\u2019s href.');
      }
    });
  });

});
