document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initPreloader();
  initCustomCursor();
  initScrollProgress();
  initNavigation();
  initInteractiveEnvelope();
  initCountdownTimer();
  initScrollAnimations();
  initGalleryLightbox();
  initAmbientParticles();
  initAudioPlayer();
  initializeEntryGate();
});

/* --------------------------------------------------------------------------
   FULLSCREEN LUXURY ENVELOPE ENTRY GATE MODULE
   -------------------------------------------------------------------------- */
let isOpeningInvitation = false;

function initializeEntryGate() {
  const gate = document.getElementById('entry-gate');
  const gateButton = document.getElementById('entry-gate-button');
  const actionButton = document.getElementById('entry-action-button');
  if (!gate) return;

  // Scroll lock active while gate is present
  document.documentElement.classList.add('gate-active');
  document.body.classList.add('gate-active');

  // Trigger on button click or tap
  [gateButton, actionButton].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openInvitation();
      });
    }
  });

  // Allow tapping anywhere on the envelope overlay to open
  gate.addEventListener('click', () => {
    openInvitation();
  });

  // Keyboard accessibility: Enter or Space key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!gate.classList.contains('hidden-gate') && !isOpeningInvitation) {
        e.preventDefault();
        openInvitation();
      }
    }
  });

  // Initialize sparkles canvas on entry gate
  initEntrySparkles();
}

function openInvitation() {
  if (isOpeningInvitation) return;
  isOpeningInvitation = true;

  const gate = document.getElementById('entry-gate');
  const gateButton = document.getElementById('entry-gate-button');
  if (!gate) return;

  // 1. Play soft paper-opening chime audio if Web Audio is available
  playOpeningSound();

  // 2. Sparkle particle burst effect around the seal button
  if (gateButton && typeof createSparkleBurst === 'function') {
    createSparkleBurst(gateButton);
  }

  // 3. Add 3D flap opening animation class
  gate.classList.add('opening-gate');

  // 4. Smoothly finish transition after 1.8s - 2.2s
  setTimeout(() => {
    gate.classList.add('opened-gate');
    closeEntryGate();
  }, 2000);
}

function closeEntryGate() {
  const gate = document.getElementById('entry-gate');
  if (!gate) return;

  // Restore document scrollability
  document.documentElement.classList.remove('gate-active');
  document.body.classList.remove('gate-active');

  // Disable entry gate overlay completely
  gate.classList.add('hidden-gate');
  gate.style.display = 'none';
}

function playOpeningSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    ctx.resume();

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // Soft C5 E5 G5 C6 chord
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (err) {
    // Audio fallback ignored
  }
}

function initEntrySparkles() {
  const canvas = document.getElementById('entry-sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2
    });
  }

  function draw() {
    const gate = document.getElementById('entry-gate');
    if (gate && gate.classList.contains('hidden-gate')) return;

    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 194, 154, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   1. PRELOADER
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 800);
  });

  // Fallback timeout in case window load fires slowly
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 2500);
}

/* --------------------------------------------------------------------------
   2. CUSTOM CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state detection
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .envelope-wrapper, .gallery-item, .filter-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL PROGRESS BAR & BACK TO TOP
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navMobileBtn = document.querySelector('.nav-mobile-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navBackdrop = document.getElementById('nav-backdrop');
  const sections = document.querySelectorAll('section[id]');

  let lastScrollY = window.scrollY;

  function updateScrollState() {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    // Add shadow styling when scrolled down past top threshold
    if (currentScrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Auto-hide navbar when scrolling down, show when scrolling up
    const isMobileMenuOpen = navMenu && navMenu.classList.contains('active');
    if (!isMobileMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling DOWN -> Hide navbar smoothly
        navbar.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP -> Reveal navbar smoothly
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;

    // Active link detection based on section scroll offset
    const navHeight = navbar.offsetHeight || 80;
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 40;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    const activeSection = document.querySelector(`section[id="${currentSectionId}"]`);
    if (activeSection && activeSection.dataset.bg) {
      setBodyBackground(activeSection.dataset.bg);
    }
  }

  function setBodyBackground(state) {
    const classes = ['bg-hero', 'bg-invitation', 'bg-story', 'bg-events', 'bg-countdown', 'bg-gallery', 'bg-venue', 'bg-default'];
    document.body.classList.remove(...classes);
    document.body.classList.add(`bg-${state || 'default'}`);
  }

  function initBackgroundState() {
    const initialSection = document.querySelector('section[data-bg]');
    if (initialSection) {
      setBodyBackground(initialSection.dataset.bg || 'default');
    }
  }

  window.addEventListener('scroll', updateScrollState);
  updateScrollState();
  initBackgroundState();

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      const bgState = targetSection.dataset.bg || 'default';
      setBodyBackground(bgState);
    });
  });

  function closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (navMobileBtn) {
      const icon = navMobileBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  }

  function openMobileMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (navMobileBtn) {
      const icon = navMobileBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    }
  }

  // Mobile menu button click handler
  if (navMobileBtn && navMenu) {
    navMobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when tapping backdrop overlay
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu when tapping anywhere outside navbar and menu
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Auto close menu when user begins scrolling or touching outside
    window.addEventListener('scroll', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      }
    }, { passive: true });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE ENVELOPE
   -------------------------------------------------------------------------- */
function initInteractiveEnvelope() {
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');

  if (!envelope) return;

  envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');

    if (envelope.classList.contains('open')) {
      if (envelopeHint) envelopeHint.textContent = 'Click to Close Envelope';
      createSparkleBurst(envelope);
    } else {
      if (envelopeHint) envelopeHint.textContent = 'Click Envelope to Open Invitation';
    }
  });
}

function createSparkleBurst(element) {
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${rect.left + rect.width / 2}px`;
    sparkle.style.top = `${rect.top + rect.height / 2}px`;
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.backgroundColor = '#D6C29A';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 80;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    document.body.appendChild(sparkle);

    sparkle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    }).onfinish = () => sparkle.remove();
  }
}

/* --------------------------------------------------------------------------
   6. COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const weddingDate = new Date('February 10, 2027 05:00:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   7. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. PHOTO GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentGalleryIndex = 0;
  const visibleImages = [];

  // Filter gallery items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'scaleIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || img.alt;
    if (lightboxImg && lightboxModal) {
      lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    }
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(galleryItems[currentGalleryIndex]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      openLightbox(galleryItems[currentGalleryIndex]);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}


function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#7B8362', '#D6C29A', '#A8B89A', '#FFFDF8', '#B89F6B'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.rotation += p.rSpeed;

      if (p.y < canvas.height) active = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (active) {
      requestAnimationFrame(renderConfetti);
    } else {
      canvas.remove();
    }
  }

  renderConfetti();
}

/* --------------------------------------------------------------------------
   10. AMBIENT PARTICLES CANVAS
   -------------------------------------------------------------------------- */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 194, 154, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   11. AUDIO PLAYER
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const musicBtn = document.getElementById('music-toggle');
  if (!musicBtn) return;

  let isPlaying = false;
  // Synthesize soft romantic ambient chords using Web Audio API on click
  let audioCtx = null;
  let osc = null;
  let gainNode = null;

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isPlaying) {
      if (gainNode) gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      musicBtn.classList.remove('playing');
      isPlaying = false;
    } else {
      audioCtx.resume();
      osc = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Soft A4 note

      gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 1);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();

      musicBtn.classList.add('playing');
      isPlaying = true;
    }
  });
}
