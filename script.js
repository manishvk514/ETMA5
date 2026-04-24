(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.getElementById('cursor');
  const cursorLabel = cursor?.querySelector('.cursor-label');
  const preloader = document.getElementById('preloader');
  const heroMeta = document.getElementById('hero-meta');
  const navTimecode = document.getElementById('nav-timecode');
  const progressBar = document.getElementById('scroll-progress-bar');
  const stills = Array.from(document.querySelectorAll('.hero-still'));
  const archiveCards = Array.from(document.querySelectorAll('.archive-card'));
  const featuredImage = document.getElementById('featured-image');
  const featuredTitle = document.getElementById('featured-title');
  const featuredLine = document.getElementById('featured-line');
  const featuredCode = document.getElementById('featured-code');
  const featuredYear = document.getElementById('featured-year');
  const corridorTrack = document.getElementById('corridor-track');
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  const projects = {
    jiostar: {
      title: 'JioStar',
      line: 'Nine channels. One family.',
      code: 'project 01 / flagship',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2200&q=90'
    },
    vida: {
      title: 'Hero Vida',
      line: "Electric. Where a crane can't go.",
      code: 'project 02 / motion',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2200&q=90'
    },
    krishna: {
      title: 'Krishna',
      line: 'The first frames of something new.',
      code: 'project 03 / launch',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?auto=format&fit=crop&w=2200&q=90'
    },
    surili: {
      title: 'Surili Didi',
      line: 'A character, engineered.',
      code: 'project 04 / animation',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1574267432644-f410f8ec2d4b?auto=format&fit=crop&w=2200&q=90'
    },
    untitled: {
      title: 'Untitled',
      line: "The kind we make when nobody's asking.",
      code: 'project 05 / self-initiated',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2200&q=90'
    }
  };

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    setTimeout(() => preloader?.classList.add('done'), 1400);
  });

  if (stills.length && !reduced) {
    let index = 0;
    setInterval(() => {
      stills[index].classList.remove('active');
      index = (index + 1) % stills.length;
      stills[index].classList.add('active');
      if (heroMeta) heroMeta.textContent = stills[index].dataset.meta || '';
    }, 3600);
  }

  const setProject = (key) => {
    const project = projects[key];
    if (!project) return;
    archiveCards.forEach(card => card.classList.toggle('active', card.dataset.project === key));
    featuredImage.style.opacity = '0.25';
    setTimeout(() => {
      featuredImage.src = project.image;
      featuredImage.alt = project.title;
      featuredTitle.textContent = project.title;
      featuredLine.textContent = project.line;
      featuredCode.textContent = project.code;
      featuredYear.textContent = project.year;
      featuredImage.style.opacity = '1';
    }, 180);
  };

  archiveCards.forEach(card => {
    const activate = () => setProject(card.dataset.project);
    card.addEventListener('mouseenter', activate);
    card.addEventListener('focus', activate);
    card.addEventListener('click', activate);
  });

  if (cursor && !('ontouchstart' in window)) {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    const lerp = (a, b, n) => a + (b - a) * n;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    const tick = () => {
      cx = lerp(cx, x, 0.2); cy = lerp(cy, y, 0.2);
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll('[data-cursor], a, button, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const label = el.dataset.cursor || (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) ? 'type' : 'view');
        cursor.classList.add(['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) ? 'text' : 'active');
        cursorLabel.textContent = label;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active', 'text');
        cursorLabel.textContent = 'view';
      });
    });
  }

  const formatTime = (p) => {
    const total = Math.round(p * 9600);
    const hh = String(Math.floor(total / 3600)).padStart(2, '0');
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (progressBar) progressBar.style.height = `${p * 100}%`;
    if (navTimecode) navTimecode.textContent = formatTime(p);

    if (corridorTrack) {
      const section = document.querySelector('.reel-corridor');
      const rect = section.getBoundingClientRect();
      const total = Math.max(0, rect.height - innerHeight);
      const local = Math.min(1, Math.max(0, (-rect.top) / (total || 1)));
      const shift = local * Math.max(0, corridorTrack.scrollWidth - innerWidth + 40);
      corridorTrack.style.transform = `translateX(${-shift}px)`;
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.positioning-panel, .method-card, .section-head, .conviction-inner').forEach(el => {
    observer.observe(el);
    if (el.classList.contains('method-card') || el.classList.contains('conviction-inner')) el.classList.add('reveal');
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const email = String(data.get('email') || '').trim();
    const type = String(data.get('type') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !type || !message) {
      formStatus.textContent = 'please fill in the required fields.';
      return;
    }
    const subject = `New project — ${company || name}`;
    const body = [
      `Name: ${name}`,
      `Company / project: ${company || '—'}`,
      `Email: ${email}`,
      `Type: ${type}`,
      '',
      message
    ].join('\n');
    formStatus.textContent = 'opening your email…';
    window.location.href = `mailto:hello@everythingmedia.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => { formStatus.textContent = 'or write directly'; }, 1800);
  });
})();
